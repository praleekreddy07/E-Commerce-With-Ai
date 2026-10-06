package com.dealai.backend.service;

import com.dealai.backend.dto.OrderItemResponse;
import com.dealai.backend.dto.OrderResponse;
import com.dealai.backend.entity.*;
import com.dealai.backend.enums.OrderStatus;
import com.dealai.backend.exception.ApiException;
import com.dealai.backend.repository.CartRepository;
import com.dealai.backend.repository.OrderRepository;
import com.dealai.backend.repository.ProductRepository;
import com.dealai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse checkout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.CONFIRMED)
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found: " + item.getProduct().getId()));

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Not enough stock for product: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(item.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order saved = orderRepository.save(order);
        cart.getItems().clear();
        cartRepository.save(cart);

        return toResponse(saved);
    }

    public List<OrderResponse> getOrderHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .priceAtPurchase(item.getPriceAtPurchase())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
