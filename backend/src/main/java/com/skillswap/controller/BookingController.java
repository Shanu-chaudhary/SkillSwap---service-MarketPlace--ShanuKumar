package com.skillswap.controller;

import com.skillswap.dto.BookingDto;
import com.skillswap.model.Booking;
import com.skillswap.service.BookingService;
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
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody BookingDto.CreateBookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(userDetails.getUsername(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<Page<Booking>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingService.getClientBookings(userDetails.getUsername(), page, size));
    }

    @GetMapping("/provider-bookings")
    public ResponseEntity<Page<Booking>> getProviderBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingService.getProviderBookings(userDetails.getUsername(), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@AuthenticationPrincipal UserDetails userDetails,
                                             @PathVariable String id) {
        try {
            Booking booking = bookingService.getBookingById(userDetails.getUsername(), id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@AuthenticationPrincipal UserDetails userDetails,
                                                  @PathVariable String id,
                                                  @RequestBody BookingDto.UpdateBookingRequest request) {
        try {
            Booking booking = bookingService.updateBookingStatus(userDetails.getUsername(), id, request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
