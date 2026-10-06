package com.dealai.backend.controller;

import com.dealai.backend.entity.Product;
import com.dealai.backend.entity.User;
import com.dealai.backend.entity.Wishlist;
import com.dealai.backend.exception.ApiException;
import com.dealai.backend.repository.ProductRepository;
import com.dealai.backend.repository.UserRepository;
import com.dealai.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WishlistController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WishlistRepository wishlistRepository;

    @GetMapping("/wishlist")
    public List<Wishlist> getWishlist(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return wishlistRepository.findByUserId(user.getId());
    }

    @PostMapping("/wishlist")
    public ResponseEntity<Wishlist> addToWishlist(@RequestParam Long productId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        boolean alreadyExists = wishlistRepository.findByUserId(user.getId()).stream()
                .anyMatch(item -> item.getProduct().getId().equals(productId));
        if (alreadyExists) {
            throw new ApiException(HttpStatus.CONFLICT, "Product already in wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();

        return ResponseEntity.ok(wishlistRepository.save(wishlist));
    }

    @DeleteMapping("/wishlist")
    public ResponseEntity<Void> removeFromWishlist(@RequestParam Long productId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        Wishlist item = wishlistRepository.findByUserId(user.getId()).stream()
                .filter(w -> w.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found in wishlist"));

        wishlistRepository.delete(item);
        return ResponseEntity.noContent().build();
    }
}
