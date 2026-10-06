package com.dealai.backend.controller;

import com.dealai.backend.dto.OrderResponse;
import com.dealai.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(Authentication authentication) {
        return ResponseEntity.ok(orderService.checkout(authentication.getName()));
    }

    @GetMapping
    public List<OrderResponse> getOrders(Authentication authentication) {
        return orderService.getOrderHistory(authentication.getName());
    }
}
