package com.dealai.backend.service;

import com.dealai.backend.dto.DealRecommendationResponse;
import com.dealai.backend.entity.ExternalProductOffer;
import com.dealai.backend.entity.Product;
import com.dealai.backend.exception.ApiException;
import com.dealai.backend.repository.ProductRepository;
import com.dealai.backend.service.offer.ExternalOfferProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

/**
 * The proactive "AI DealBot" brain.
 *
 * Given a product the user is seriously considering, this evaluates every
 * available external offer against our own listing and produces a single
 * best recommendation, if one clears the bar for being worth interrupting
 * the user's shopping flow.
 *
 * Design notes:
 *  - We never recommend on price alone. Each offer gets a weighted
 *    Deal Score across total landed cost, delivery speed, rating and review
 *    volume (a 4.9★ / 3 reviews listing shouldn't beat a 4.6★ / 50k reviews one).
 *  - "Meaningful savings" is a configurable threshold so that a ₹5 price
 *    difference never triggers a notification (min-meaningful-saving-percent).
 *  - When prices are roughly equal, price stops dominating the score and
 *    delivery/rating/reviews decide the recommendation instead.
 */
@Service
@RequiredArgsConstructor
public class DealComparisonService {

    private final ProductRepository productRepository;
    private final ExternalOfferProvider offerProvider;

    @Value("${app.deal-engine.min-meaningful-saving-percent}")
    private double minMeaningfulSavingPercent;

    // Weights when there IS a meaningful price gap.
    private static final double W_PRICE = 0.50;
    private static final double W_DELIVERY = 0.20;
    private static final double W_RATING = 0.20;
    private static final double W_REVIEWS = 0.10;

    // Weights when prices are roughly equal - price stops dominating.
    private static final double W_PRICE_TIE = 0.15;
    private static final double W_DELIVERY_TIE = 0.35;
    private static final double W_RATING_TIE = 0.35;
    private static final double W_REVIEWS_TIE = 0.15;

    public DealRecommendationResponse evaluate(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        List<ExternalProductOffer> offers = offerProvider.fetchOffers(product);

        BigDecimal ourTotalCost = product.getPrice(); // assume free shipping on own store for v1

        Optional<ScoredOffer> best = offers.stream()
                .map(offer -> score(product, ourTotalCost, offer))
                .max((a, b) -> Double.compare(a.dealScore(), b.dealScore()));

        if (best.isEmpty()) {
            return noDealFound();
        }

        ScoredOffer winner = best.get();
        BigDecimal savings = ourTotalCost.subtract(winner.totalCost());
        boolean meaningfulSaving = isMeaningfulSaving(ourTotalCost, winner.totalCost());

        // Only surface a notification if the external option genuinely beats
        // ours: either real savings, or a materially higher deal score at
        // roughly the same price (better delivery/rating/reviews).
        boolean worthSurfacing = meaningfulSaving || winner.dealScore() > baselineScore(product) + 8.0;

        if (!worthSurfacing) {
            return noDealFound();
        }

        String message = buildMessage(winner, savings, meaningfulSaving);

        return DealRecommendationResponse.builder()
                .betterDealFound(true)
                .platform(winner.offer().getPlatform().name())
                .offerPrice(winner.offer().getPrice())
                .potentialSavings(savings.max(BigDecimal.ZERO))
                .dealScore(round(winner.dealScore()))
                .message(message)
                .productUrl(winner.offer().getProductUrl())
                .build();
    }

    private boolean isMeaningfulSaving(BigDecimal ourPrice, BigDecimal theirPrice) {
        if (theirPrice.compareTo(ourPrice) >= 0) return false;
        BigDecimal diffPercent = ourPrice.subtract(theirPrice)
                .divide(ourPrice, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        return diffPercent.doubleValue() >= minMeaningfulSavingPercent;
    }

    private ScoredOffer score(Product product, BigDecimal ourTotalCost, ExternalProductOffer offer) {
        BigDecimal theirTotalCost = offer.getPrice().add(offer.getShippingCost());
        boolean meaningful = isMeaningfulSaving(ourTotalCost, theirTotalCost);

        double wPrice = meaningful ? W_PRICE : W_PRICE_TIE;
        double wDelivery = meaningful ? W_DELIVERY : W_DELIVERY_TIE;
        double wRating = meaningful ? W_RATING : W_RATING_TIE;
        double wReviews = meaningful ? W_REVIEWS : W_REVIEWS_TIE;

        double priceScore = priceScore(ourTotalCost, theirTotalCost);
        double deliveryScore = deliveryScore(offer.getEstimatedDeliveryDays());
        double ratingScore = (offer.getRating() / 5.0) * 100.0;
        double reviewScore = reviewScore(offer.getReviewCount());

        double dealScore = (priceScore * wPrice)
                + (deliveryScore * wDelivery)
                + (ratingScore * wRating)
                + (reviewScore * wReviews);

        return new ScoredOffer(offer, theirTotalCost, dealScore);
    }

    /** A rough "how good is our own listing" baseline, for tie-break comparisons. */
    private double baselineScore(Product product) {
        double ratingScore = (product.getRatingAverage() / 5.0) * 100.0;
        double reviewScore = reviewScore(product.getReviewCount());
        return (ratingScore * 0.6) + (reviewScore * 0.4);
    }

    private double priceScore(BigDecimal ourCost, BigDecimal theirCost) {
        if (ourCost.compareTo(BigDecimal.ZERO) == 0) return 50.0;
        double ratio = theirCost.doubleValue() / ourCost.doubleValue();
        // Cheaper -> higher score, capped so a near-free glitch price can't break scaling.
        double score = (1.0 - ratio) * 200.0 + 50.0;
        return clamp(score, 0, 100);
    }

    private double deliveryScore(int days) {
        // 1 day -> 100, 10+ days -> near 0, linear in between.
        double score = 100.0 - ((days - 1) * (100.0 / 9.0));
        return clamp(score, 0, 100);
    }

    private double reviewScore(int reviewCount) {
        // Diminishing returns: log scale, caps out around 50k+ reviews.
        double score = (Math.log10(reviewCount + 1) / Math.log10(50_000)) * 100.0;
        return clamp(score, 0, 100);
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private String buildMessage(ScoredOffer winner, BigDecimal savings, boolean meaningfulSaving) {
        String platform = capitalize(winner.offer().getPlatform().name());
        if (meaningfulSaving) {
            int deliveryDays = winner.offer().getEstimatedDeliveryDays();
            String deliveryTime = deliveryDays == 1 ? "1 day" : deliveryDays + " days";
            return String.format(
                "Hold on! I found the same product on %s for ₹%s less, with %s delivery and a %.1f★ rating. You could save ₹%s.",
                platform, savings.setScale(0, RoundingMode.HALF_UP), deliveryTime,
                    winner.offer().getRating(), savings.setScale(0, RoundingMode.HALF_UP));
        }
        int deliveryDays = winner.offer().getEstimatedDeliveryDays();
        String deliveryTime = deliveryDays == 1 ? "1 day" : deliveryDays + " days";
        return String.format(
            "Prices are about the same, but %s ships in %s with a %.1f★ rating (%,d reviews) — might be the safer buy.",
            platform, deliveryTime, winner.offer().getRating(), winner.offer().getReviewCount());
    }

    private String capitalize(String s) {
        return s.charAt(0) + s.substring(1).toLowerCase();
    }

    private DealRecommendationResponse noDealFound() {
        return DealRecommendationResponse.builder()
                .betterDealFound(false)
                .dealScore(0)
                .message("You're already looking at the best available option.")
                .build();
    }

    private record ScoredOffer(ExternalProductOffer offer, BigDecimal totalCost, double dealScore) {
    }
}
