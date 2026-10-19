package com.skillswap.dto;

import com.skillswap.model.Booking;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class BookingDto {

    @Data
    public static class CreateBookingRequest {
        @NotBlank(message = "Service ID is required")
        private String serviceId;

        @NotNull(message = "Scheduled date is required")
        private LocalDateTime scheduledAt;

        private String notes;
    }

    @Data
    public static class BookingResponse {
        private String id;
        private String serviceId;
        private String serviceTitle;
        private String serviceThumbnail;
        private String clientId;
        private String clientName;
        private String clientAvatar;
        private String providerId;
        private String providerName;
        private Double amount;
        private Booking.BookingStatus status;
        private LocalDateTime scheduledAt;
        private LocalDateTime completedAt;
        private String notes;
        private Boolean reviewed;
        private String meetingLink;
        private Booking.PaymentStatus paymentStatus;
        private LocalDateTime createdAt;
    }

    @Data
    public static class UpdateBookingRequest {
        private Booking.BookingStatus status;
        private String cancellationReason;
        private String meetingLink;
    }
}
