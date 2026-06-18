package com.example.PetCare.service;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class PaseoWebSocketHandler extends TextWebSocketHandler {

    private final Map<Integer, List<WebSocketSession>> paseoSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Integer paseoId = extractPaseoId(session.getUri());
        if (paseoId != null) {
            paseoSessions.computeIfAbsent(paseoId, k -> new CopyOnWriteArrayList<>()).add(session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        paseoSessions.values().forEach(list -> list.remove(session));
    }

    public void enviarUbicacion(Integer paseoId, String mensajeJson) {
        List<WebSocketSession> sessions = paseoSessions.get(paseoId);
        if (sessions != null) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(new TextMessage(mensajeJson));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private Integer extractPaseoId(URI uri) {
        if (uri == null) return null;
        String path = uri.getPath();
        String[] segments = path.split("/");
        try {
            return Integer.parseInt(segments[segments.length - 1]);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
