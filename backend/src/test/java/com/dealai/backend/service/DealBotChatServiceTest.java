package com.dealai.backend.service;

import com.dealai.backend.dto.DealBotChatRequest;
import com.dealai.backend.exception.ApiException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DealBotChatServiceTest {

    @Test
    void replyExplainsSetupWhenGeminiKeyIsMissing() {
        DealBotChatService service = new DealBotChatService(
                RestClient.builder(), "", "gemini-2.5-flash");
        DealBotChatRequest request = new DealBotChatRequest("Hi", List.of(), "", "");

        ApiException exception = assertThrows(ApiException.class, () -> service.reply(request));

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatus());
        assertTrue(exception.getMessage().contains("GEMINI_API_KEY"));
    }
}
