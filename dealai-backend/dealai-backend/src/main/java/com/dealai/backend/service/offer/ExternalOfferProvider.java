package com.dealai.backend.service.offer;

import com.dealai.backend.entity.ExternalProductOffer;
import com.dealai.backend.entity.Product;

import java.util.List;

/**
 * Contract for anything that can produce competing marketplace offers for a
 * product. Swap MockOfferProvider for a real scraper/affiliate-API adapter
 * later without touching DealComparisonService at all.
 */
public interface ExternalOfferProvider {
    List<ExternalProductOffer> fetchOffers(Product product);
}
