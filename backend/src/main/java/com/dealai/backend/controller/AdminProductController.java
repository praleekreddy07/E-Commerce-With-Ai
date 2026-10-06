package com.dealai.backend.controller;

import com.dealai.backend.dto.ProductRequest;
import com.dealai.backend.entity.Category;
import com.dealai.backend.entity.Product;
import com.dealai.backend.exception.ApiException;
import com.dealai.backend.repository.CategoryRepository;
import com.dealai.backend.repository.ProductRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Category not found"));

        Product product = Product.builder()
                .name(request.getName().trim())
                .modelIdentifier(request.getModelIdentifier())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .ratingAverage(request.getRatingAverage() == null ? 0.0 : request.getRatingAverage())
                .reviewCount(request.getReviewCount() == null ? 0 : request.getReviewCount())
                .category(category)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(productRepository.save(product));
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Category not found"));

        product.setName(request.getName().trim());
        product.setModelIdentifier(request.getModelIdentifier());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);

        if (request.getRatingAverage() != null) {
            product.setRatingAverage(request.getRatingAverage());
        }
        if (request.getReviewCount() != null) {
            product.setReviewCount(request.getReviewCount());
        }

        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        productRepository.delete(product);
        return ResponseEntity.noContent().build();
    }
}
