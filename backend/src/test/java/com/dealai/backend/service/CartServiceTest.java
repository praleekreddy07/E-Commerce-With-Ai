package com.dealai.backend.service;

import com.dealai.backend.entity.Cart;
import com.dealai.backend.entity.CartItem;
import com.dealai.backend.entity.Product;
import com.dealai.backend.entity.User;
import com.dealai.backend.enums.Role;
import com.dealai.backend.repository.CartItemRepository;
import com.dealai.backend.repository.CartRepository;
import com.dealai.backend.repository.ProductRepository;
import com.dealai.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void addItem_shouldMergeQuantityWhenProductAlreadyExistsInCart() {
        User user = User.builder().id(1L).email("user@example.com").passwordHash("hash").fullName("User").role(Role.USER).build();
        Product product = Product.builder().id(10L).name("Headphones").price(new BigDecimal("4999")).stockQuantity(10).build();
        Cart cart = Cart.builder().id(5L).user(user).build();
        CartItem cartItem = CartItem.builder().id(99L).cart(cart).product(product).quantity(1).build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartIdAndProductId(5L, 10L)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CartItem saved = cartService.addItem("user@example.com", 10L, 2);

        assertEquals(3, saved.getQuantity());
    }
}
