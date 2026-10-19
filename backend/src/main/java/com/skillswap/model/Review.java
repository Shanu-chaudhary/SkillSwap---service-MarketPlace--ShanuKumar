package com.skillswap.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String bookingId;
    private String serviceId;
    private String reviewerId;
    private String reviewerName;
    private String reviewerAvatar;
    private String providerId;

    private Integer rating;
    private String comment;

    private String providerResponse;
    private LocalDateTime respondedAt;

    @CreatedDate
    private LocalDateTime createdAt;
}
