package com.skillswap.service;

import com.skillswap.dto.ReviewDto;
import com.skillswap.model.Booking;
import com.skillswap.model.Review;
import com.skillswap.model.User;
import com.skillswap.repository.BookingRepository;
import com.skillswap.repository.ReviewRepository;
import com.skillswap.repository.ServiceRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalDouble;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    public Review createReview(String clientEmail, ReviewDto.CreateReviewRequest request) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getClientId().equals(client.getId())) {
            throw new RuntimeException("Unauthorized to review this booking");
        }

        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Can only review completed bookings");
        }

        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new RuntimeException("Review already exists for this booking");
        }

        Review review = Review.builder()
                .bookingId(booking.getId())
                .serviceId(booking.getServiceId())
                .reviewerId(client.getId())
                .reviewerName(client.getName())
                .reviewerAvatar(client.getAvatar())
                .providerId(booking.getProviderId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        reviewRepository.save(review);

        booking.setReviewed(true);
        bookingRepository.save(booking);

        updateServiceRating(booking.getServiceId());
        updateProviderRating(booking.getProviderId());

        return review;
    }

    public Page<Review> getServiceReviews(String serviceId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return reviewRepository.findByServiceId(serviceId, pageable);
    }

    public Review addProviderResponse(String providerEmail, String reviewId,
                                       ReviewDto.ProviderResponseRequest request) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getProviderId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized to respond to this review");
        }

        review.setProviderResponse(request.getResponse());
        review.setRespondedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    private void updateServiceRating(String serviceId) {
        serviceRepository.findById(serviceId).ifPresent(service -> {
            List<Review> reviews = reviewRepository.findByProviderId(service.getProviderId());
            List<Review> serviceReviews = reviews.stream()
                    .filter(r -> r.getServiceId().equals(serviceId)).toList();
            OptionalDouble avg = serviceReviews.stream()
                    .mapToInt(Review::getRating).average();
            service.setRating(avg.isPresent() ? Math.round(avg.getAsDouble() * 10.0) / 10.0 : 0.0);
            service.setReviewCount(serviceReviews.size());
            serviceRepository.save(service);
        });
    }

    private void updateProviderRating(String providerId) {
        userRepository.findById(providerId).ifPresent(provider -> {
            List<Review> reviews = reviewRepository.findByProviderId(providerId);
            OptionalDouble avg = reviews.stream()
                    .mapToInt(Review::getRating).average();
            provider.setRating(avg.isPresent() ? Math.round(avg.getAsDouble() * 10.0) / 10.0 : 0.0);
            provider.setReviewCount(reviews.size());
            userRepository.save(provider);
        });
    }
}
