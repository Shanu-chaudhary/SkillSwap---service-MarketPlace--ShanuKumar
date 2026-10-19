package com.skillswap.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    private String conversationId;
    private String senderId;
    private String senderName;
    private String senderAvatar;
    private String receiverId;

    private String content;
    private String type; // TEXT, IMAGE, FILE

    private boolean read;

    @CreatedDate
    private LocalDateTime createdAt;
}
