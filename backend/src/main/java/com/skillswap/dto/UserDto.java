package com.skillswap.dto;

import com.skillswap.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String name;
    private String email;
    private String avatar;
    private String bio;
    private String location;
    private String phone;
    private Double rating;
    private Integer reviewCount;
    private Integer completedBookings;
    private Set<String> skills;
    private Set<User.Role> roles;
    private String authProvider;
    private boolean emailVerified;
    private LocalDateTime createdAt;

    public static UserDto fromUser(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .location(user.getLocation())
                .phone(user.getPhone())
                .rating(user.getRating())
                .reviewCount(user.getReviewCount())
                .completedBookings(user.getCompletedBookings())
                .skills(user.getSkills())
                .roles(user.getRoles())
                .authProvider(user.getAuthProvider())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Data
    public static class UpdateProfileRequest {
        private String name;
        private String bio;
        private String location;
        private String phone;
        private Set<String> skills;
    }
}
