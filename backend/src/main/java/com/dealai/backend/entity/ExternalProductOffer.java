package com.dealai.backend.entity;

import com.dealai.backend.enums.Platform;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a competing offer for one of our products on an external
 * (or our own) marketplace. This is the data the Deal Comparison Engine
 * scores against the product's own listing.
 *
 * In v1, rows here are seeded/mocked via ExternalOfferProvider implementations
 * rather than scraped live — see service.offer package.
 */
@Entity
@Table(name = "external_product_offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalProductOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Platform platform;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal shippingCost = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer estimatedDeliveryDays;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private Integer reviewCount;

    private String sellerName;

    private String productUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;

    @Builder.Default
    private LocalDateTime fetchedAt = LocalDateTime.now();
}
