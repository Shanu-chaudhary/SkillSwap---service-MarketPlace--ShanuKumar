package com.skillswap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

public class ServiceDto {

    @Data
    public static class CreateServiceRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        private String subcategory;

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        private Double price;

        @NotBlank(message = "Price type is required")
        private String priceType; // HOURLY, FIXED, DAILY

        private List<String> tags;
        private List<String> features;
        private String deliveryTime;
        private String location;
        private boolean isRemote;
        private List<String> images;
        private String thumbnail;
    }

    @Data
    public static class UpdateServiceRequest {
        private String title;
        private String description;
        private String category;
        private String subcategory;
        private Double price;
        private String priceType;
        private List<String> tags;
        private List<String> features;
        private String deliveryTime;
        private String location;
        private boolean isRemote;
        private List<String> images;
        private String thumbnail;
    }

    @Data
    public static class ServiceResponse {
        private String id;
        private String providerId;
        private String providerName;
        private String providerAvatar;
        private Double providerRating;
        private String title;
        private String description;
        private String category;
        private String subcategory;
        private Double price;
        private String priceType;
        private List<String> images;
        private String thumbnail;
        private List<String> tags;
        private Double rating;
        private Integer reviewCount;
        private Integer totalBookings;
        private String deliveryTime;
        private List<String> features;
        private boolean active;
        private String location;
        private boolean isRemote;
    }
}
