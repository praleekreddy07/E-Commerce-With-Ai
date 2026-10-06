package com.dealai.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String modelIdentifier;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Positive(message = "Stock quantity must be positive")
    private Integer stockQuantity;

    private String imageUrl;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private Double ratingAverage = 0.0;
    private Integer reviewCount = 0;
}
