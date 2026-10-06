package com.dealai.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record DealBotChatRequest(
        @NotBlank @Size(max = 1000) String message,
        @Size(max = 8) List<@Valid ChatTurn> history,
        @Size(max = 1600) String productContext,
        @Size(max = 1200) String dealContext
) {
    public record ChatTurn(
            @NotBlank @Pattern(regexp = "user|model") String role,
            @NotBlank @Size(max = 1000) String text
    ) {
    }
}
