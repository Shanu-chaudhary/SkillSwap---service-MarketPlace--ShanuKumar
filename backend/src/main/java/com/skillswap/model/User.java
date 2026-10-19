package com.skillswap.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String avatar;

    private String bio;

    private String location;

    private String phone;

    private Double rating;

    private Integer reviewCount;

    private Integer completedBookings;

    @Builder.Default
    private Set<String> skills = new HashSet<>();

    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    private String authProvider; // LOCAL, GOOGLE, GITHUB

    private String providerId;

    private boolean emailVerified;

    private boolean active;

    private String resetToken;

    private LocalDateTime resetTokenExpiry;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Role {
        ROLE_USER, ROLE_ADMIN, ROLE_PROVIDER
    }
}
