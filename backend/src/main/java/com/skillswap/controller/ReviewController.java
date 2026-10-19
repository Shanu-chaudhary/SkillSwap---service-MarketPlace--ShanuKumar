package com.skillswap.controller;

import com.skillswap.dto.ReviewDto;
import com.skillswap.model.Review;
import com.skillswap.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(@AuthenticationPrincipal UserDetails userDetails,
                                           @Valid @RequestBody ReviewDto.CreateReviewRequest request) {
        try {
            Review review = reviewService.createReview(userDetails.getUsername(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<Page<Review>> getServiceReviews(
            @PathVariable String serviceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getServiceReviews(serviceId, page, size));
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<?> respondToReview(@AuthenticationPrincipal UserDetails userDetails,
                                              @PathVariable String id,
                                              @RequestBody ReviewDto.ProviderResponseRequest request) {
        try {
            Review review = reviewService.addProviderResponse(userDetails.getUsername(), id, request);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
