package com.skillswap.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "services")
public class Service {

    @Id
    private String id;

    private String providerId;
    private String providerName;
    private String providerAvatar;
    private Double providerRating;

    @TextIndexed
    private String title;

    @TextIndexed
    private String description;

    private String category;
    private String subcategory;

    private Double price;
    private String priceType; // HOURLY, FIXED, DAILY

    private List<String> images;
    private String thumbnail;

    private List<String> tags;

    private Double rating;
    private Integer reviewCount;
    private Integer totalBookings;

    private String deliveryTime;
    private List<String> features;

    private boolean active;

    private ServiceStatus status;

    private String location;
    private boolean isRemote;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ServiceStatus {
        DRAFT, ACTIVE, PAUSED, DELETED
    }
}
