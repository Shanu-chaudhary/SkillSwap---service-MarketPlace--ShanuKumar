package com.skillswap.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
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
    private String currency;

    private BookingStatus status;

    private LocalDateTime scheduledAt;
    private LocalDateTime completedAt;

    private String notes;
    private String cancellationReason;

    private Boolean reviewed;

    private String meetingLink;

    private PaymentStatus paymentStatus;
    private String paymentId;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum BookingStatus {
        PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, DISPUTED
    }

    public enum PaymentStatus {
        PENDING, PAID, REFUNDED, FAILED
    }
}
