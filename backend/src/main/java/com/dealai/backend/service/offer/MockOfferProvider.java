package com.dealai.backend.service.offer;

import com.dealai.backend.entity.ExternalProductOffer;
import com.dealai.backend.entity.Product;
import com.dealai.backend.enums.Platform;
import com.dealai.backend.repository.ExternalProductOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * v1 implementation: reads pre-seeded/admin-entered rows from
 * external_product_offers instead of live scraping (see class-level note on
 * ExternalProductOffer for why). Deterministic, demo-safe, and trivially
 * replaceable later by a class that hits real marketplace APIs while
 * implementing the same ExternalOfferProvider interface.
 */
@Component
@RequiredArgsConstructor
public class MockOfferProvider implements ExternalOfferProvider {

    private final ExternalProductOfferRepository offerRepository;

    @Override
    public List<ExternalProductOffer> fetchOffers(Product product) {
        return offerRepository.findByProductIdAndAvailableTrue(product.getId()).stream()
                .filter(offer -> offer.getPlatform() != Platform.OWN_STORE)
                .toList();
    }
}
