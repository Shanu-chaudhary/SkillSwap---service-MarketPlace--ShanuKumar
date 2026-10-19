package com.skillswap.service;

import com.skillswap.model.Message;
import com.skillswap.model.User;
import com.skillswap.repository.MessageRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public Message sendMessage(String senderEmail, String receiverId, String content) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        String conversationId = generateConversationId(sender.getId(), receiverId);

        Message message = Message.builder()
                .conversationId(conversationId)
                .senderId(sender.getId())
                .senderName(sender.getName())
                .senderAvatar(sender.getAvatar())
                .receiverId(receiverId)
                .content(content)
                .type("TEXT")
                .read(false)
                .build();

        return messageRepository.save(message);
    }

    public List<Message> getConversation(String userEmail, String otherUserId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String conversationId = generateConversationId(user.getId(), otherUserId);
        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);

        // Mark messages as read
        messages.stream()
                .filter(m -> m.getReceiverId().equals(user.getId()) && !m.isRead())
                .forEach(m -> {
                    m.setRead(true);
                    messageRepository.save(m);
                });

        return messages;
    }

    public List<Map<String, Object>> getConversations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Message> allMessages = messageRepository.findUserConversations(user.getId());

        Map<String, Message> latestByConversation = new LinkedHashMap<>();
        for (Message msg : allMessages) {
            latestByConversation.put(msg.getConversationId(), msg);
        }

        return latestByConversation.values().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(msg -> {
                    String otherId = msg.getSenderId().equals(user.getId())
                            ? msg.getReceiverId() : msg.getSenderId();
                    Map<String, Object> conv = new HashMap<>();
                    conv.put("conversationId", msg.getConversationId());
                    conv.put("lastMessage", msg.getContent());
                    conv.put("lastMessageTime", msg.getCreatedAt());
                    conv.put("otherUserId", otherId);

                    userRepository.findById(otherId).ifPresent(other -> {
                        conv.put("otherUserName", other.getName());
                        conv.put("otherUserAvatar", other.getAvatar());
                    });

                    long unread = messageRepository.countByReceiverIdAndReadFalse(user.getId());
                    conv.put("unreadCount", unread);

                    return conv;
                })
                .collect(Collectors.toList());
    }

    private String generateConversationId(String id1, String id2) {
        return id1.compareTo(id2) < 0 ? id1 + "_" + id2 : id2 + "_" + id1;
    }
}
