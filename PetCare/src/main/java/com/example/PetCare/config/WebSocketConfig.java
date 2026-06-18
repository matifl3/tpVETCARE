package com.example.PetCare.config;

import com.example.PetCare.service.PaseoWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final PaseoWebSocketHandler paseoWebSocketHandler;

    public WebSocketConfig(PaseoWebSocketHandler paseoWebSocketHandler) {
        this.paseoWebSocketHandler = paseoWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(paseoWebSocketHandler, "/ws/paseos/{paseoId}")
                .setAllowedOriginPatterns("*");
    }
}
