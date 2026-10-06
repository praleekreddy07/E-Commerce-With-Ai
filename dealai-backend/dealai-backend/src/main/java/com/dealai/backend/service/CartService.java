package com.dealai.backend.service;

import com.dealai.backend.dto.CartItemResponse;
import com.dealai.backend.dto.CartResponse;
import com.dealai.backend.entity.Cart;
import com.dealai.backend.entity.CartItem;
import com.dealai.backend.entity.Product;
import com.dealai.backend.entity.User;
import com.dealai.backend.exception.ApiException;
import com.dealai.backend.repository.CartItemRepository;
import com.dealai.backend.repository.CartRepository;
import com.dealai.backend.repository.ProductRepository;
import com.dealai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Cart getOrCreateCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = Cart.builder().user(user).build();
                    return cartRepository.save(cart);
                });
    }

    public CartResponse getCart(String email) {
        Cart cart = getOrCreateCart(email);
        return toCartResponse(cart);
    }

    @Transactional
    public CartItem addItem(String email, Long productId, Integer quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        if (quantity == null || quantity <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
        }

        if (product.getStockQuantity() < quantity) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Not enough stock available for this product");
        }

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQuantity = item.getQuantity() + quantity;
            if (product.getStockQuantity() < newQuantity) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Not enough stock available for the combined quantity");
            }
            item.setQuantity(newQuantity);
            return cartItemRepository.save(item);
        }

        CartItem item = CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(quantity)
                .build();
        return cartItemRepository.save(item);
    }

    @Transactional
    public CartItem updateQuantity(String email, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateCart(email);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!Objects.equals(item.getCart().getId(), cart.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This cart item does not belong to the current user");
        }

        if (quantity == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Quantity is required");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return item;
        }

        Product product = item.getProduct();
        if (product.getStockQuantity() < quantity) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Not enough stock available for the updated quantity");
        }

        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeItem(String email, Long cartItemId) {
        Cart cart = getOrCreateCart(email);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!Objects.equals(item.getCart().getId(), cart.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This cart item does not belong to the current user");
        }

        cartItemRepository.delete(item);
    }

    public CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> CartItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .unitPrice(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .lineTotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .toList();

        BigDecimal total = items.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalAmount(total)
                .build();
    }
}
