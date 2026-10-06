package com.dealai.backend.controller;

import com.dealai.backend.dto.CartItemRequest;
import com.dealai.backend.dto.CartItemResponse;
import com.dealai.backend.dto.CartResponse;
import com.dealai.backend.entity.Cart;
import com.dealai.backend.entity.CartItem;
import com.dealai.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart(Authentication authentication) {
        return cartService.getCart(authentication.getName());
    }

    @PostMapping("/items")
    public ResponseEntity<CartItemResponse> addItem(@Valid @RequestBody CartItemRequest request, Authentication authentication) {
        CartItem item = cartService.addItem(authentication.getName(), request.getProductId(), request.getQuantity());
        Cart cart = cartService.getOrCreateCart(authentication.getName());
        return ResponseEntity.ok(CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .unitPrice(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .lineTotal(item.getProduct().getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))
                .build());
    }

    @PatchMapping("/items/{id}")
    public ResponseEntity<CartItemResponse> updateQuantity(@PathVariable Long id,
                                                         @RequestParam Integer quantity,
                                                         Authentication authentication) {
        CartItem item = cartService.updateQuantity(authentication.getName(), id, quantity);
        return ResponseEntity.ok(CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .unitPrice(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .lineTotal(item.getProduct().getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))
                .build());
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id, Authentication authentication) {
        cartService.removeItem(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
