package com.dealai.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * What the frontend's AI DealBot renders as its notification.
 */
@Data
@Builder
@AllArgsConstructor
public class DealRecommendationResponse {
    private boolean betterDealFound;
    private String platform;          // e.g. "FLIPKART"
    private BigDecimal offerPrice;
    private BigDecimal potentialSavings;
    private double dealScore;         // 0-100
    private String message;           // human-readable bot message
    private String productUrl;
}
