package com.skillswap.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class ReviewDto {

    @Data
    public static class CreateReviewRequest {
        @NotBlank(message = "Booking ID is required")
        private String bookingId;

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        private Integer rating;

        @NotBlank(message = "Comment is required")
        private String comment;
    }

    @Data
    public static class ReviewResponse {
        private String id;
        private String bookingId;
        private String serviceId;
        private String reviewerId;
        private String reviewerName;
        private String reviewerAvatar;
        private Integer rating;
        private String comment;
        private String providerResponse;
        private LocalDateTime respondedAt;
        private LocalDateTime createdAt;
    }

    @Data
    public static class ProviderResponseRequest {
        @NotBlank
        private String response;
    }
}
