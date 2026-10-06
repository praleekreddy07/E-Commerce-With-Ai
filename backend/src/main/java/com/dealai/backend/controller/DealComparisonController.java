package com.dealai.backend.controller;

import com.dealai.backend.dto.DealRecommendationResponse;
import com.dealai.backend.service.DealComparisonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Called by the frontend when the purchase-intent tracker (time-on-product,
 * cart add, repeated views) crosses its threshold. Frontend decides WHEN to
 * ask; this endpoint decides WHAT to recommend.
 */
@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealComparisonController {

    private final DealComparisonService dealComparisonService;

    @GetMapping("/products/{productId}/recommendation")
    public DealRecommendationResponse getRecommendation(@PathVariable Long productId) {
        return dealComparisonService.evaluate(productId);
    }
}
