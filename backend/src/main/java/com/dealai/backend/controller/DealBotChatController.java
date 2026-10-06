package com.dealai.backend.controller;

import com.dealai.backend.dto.DealBotChatRequest;
import com.dealai.backend.dto.DealBotChatResponse;
import com.dealai.backend.service.DealBotChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class DealBotChatController {

    private final DealBotChatService chatService;

    @PostMapping
    public DealBotChatResponse chat(@Valid @RequestBody DealBotChatRequest request) {
        return chatService.reply(request);
    }
}
