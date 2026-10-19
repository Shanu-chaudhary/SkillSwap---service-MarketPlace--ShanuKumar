package com.skillswap.service;

import com.skillswap.dto.UserDto;
import com.skillswap.model.User;
import com.skillswap.repository.BookingRepository;
import com.skillswap.repository.ServiceRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDto.fromUser(user);
    }

    public UserDto getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDto.fromUser(user);
    }

    public UserDto updateProfile(String email, UserDto.UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getSkills() != null) user.setSkills(request.getSkills());

        userRepository.save(user);
        return UserDto.fromUser(user);
    }

    public UserDto uploadAvatar(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir + "avatars/");
        Files.createDirectories(uploadPath);
        Files.copy(file.getInputStream(), uploadPath.resolve(filename));

        user.setAvatar("/uploads/avatars/" + filename);
        userRepository.save(user);

        return UserDto.fromUser(user);
    }

    public void addProviderRole(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getRoles().add(User.Role.ROLE_PROVIDER);
        userRepository.save(user);
    }

    public Object getDashboardStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalServices = serviceRepository.countByProviderIdAndActiveTrue(user.getId());
        long totalBookings = bookingRepository.countByProviderId(user.getId());
        long pendingBookings = bookingRepository.countByProviderIdAndStatus(
                user.getId(), com.skillswap.model.Booking.BookingStatus.PENDING);
        long completedBookings = bookingRepository.countByProviderIdAndStatus(
                user.getId(), com.skillswap.model.Booking.BookingStatus.COMPLETED);
        long clientBookings = bookingRepository.countByClientId(user.getId());

        return new java.util.HashMap<String, Object>() {{
            put("totalServices", totalServices);
            put("totalBookings", totalBookings);
            put("pendingBookings", pendingBookings);
            put("completedBookings", completedBookings);
            put("clientBookings", clientBookings);
            put("rating", user.getRating());
            put("reviewCount", user.getReviewCount());
        }};
    }
}
