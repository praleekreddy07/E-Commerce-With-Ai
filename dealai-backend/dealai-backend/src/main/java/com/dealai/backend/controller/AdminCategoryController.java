package com.dealai.backend.controller;

import com.dealai.backend.dto.CategoryRequest;
import com.dealai.backend.entity.Category;
import com.dealai.backend.exception.ApiException;
import com.dealai.backend.repository.CategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Category> create(@Valid @RequestBody CategoryRequest request) {
        if (categoryRepository.findAll().stream().anyMatch(c -> c.getName().equalsIgnoreCase(request.getName()))) {
            throw new ApiException(HttpStatus.CONFLICT, "Category already exists");
        }

        Category category = Category.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(categoryRepository.save(category));
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));

        if (!category.getName().equalsIgnoreCase(request.getName().trim()) && categoryRepository.findAll().stream()
                .anyMatch(c -> c.getId() != null && !c.getId().equals(id) && c.getName().equalsIgnoreCase(request.getName().trim()))) {
            throw new ApiException(HttpStatus.CONFLICT, "Category already exists");
        }

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));

        categoryRepository.delete(category);
        return ResponseEntity.noContent().build();
    }
}
