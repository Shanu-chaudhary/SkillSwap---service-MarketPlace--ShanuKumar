package com.skillswap.controller;

import com.skillswap.model.Message;
import com.skillswap.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@AuthenticationPrincipal UserDetails userDetails,
                                          @RequestBody Map<String, String> body) {
        try {
            Message message = messageService.sendMessage(
                    userDetails.getUsername(),
                    body.get("receiverId"),
                    body.get("content")
            );
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<Message>> getConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String userId) {
        return ResponseEntity.ok(messageService.getConversation(userDetails.getUsername(), userId));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(messageService.getConversations(userDetails.getUsername()));
    }
}
