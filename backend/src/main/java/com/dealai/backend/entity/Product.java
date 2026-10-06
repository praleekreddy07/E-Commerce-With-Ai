package com.dealai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Normalized identifier used for cross-platform matching, e.g. brand+model
    @Column(name = "model_identifier")
    private String modelIdentifier;

    @Lob
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Double ratingAverage = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer reviewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
