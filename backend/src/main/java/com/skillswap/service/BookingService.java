package com.skillswap.service;

import com.skillswap.dto.BookingDto;
import com.skillswap.model.Booking;
import com.skillswap.model.User;
import com.skillswap.repository.BookingRepository;
import com.skillswap.repository.ServiceRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    public Booking createBooking(String clientEmail, BookingDto.CreateBookingRequest request) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        com.skillswap.model.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (service.getProviderId().equals(client.getId())) {
            throw new RuntimeException("You cannot book your own service");
        }

        Booking booking = Booking.builder()
                .serviceId(service.getId())
                .serviceTitle(service.getTitle())
                .serviceThumbnail(service.getThumbnail())
                .clientId(client.getId())
                .clientName(client.getName())
                .clientAvatar(client.getAvatar())
                .providerId(service.getProviderId())
                .providerName(service.getProviderName())
                .amount(service.getPrice())
                .currency("USD")
                .status(Booking.BookingStatus.PENDING)
                .scheduledAt(request.getScheduledAt())
                .notes(request.getNotes())
                .reviewed(false)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(String userEmail, String bookingId, BookingDto.UpdateBookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        boolean isProvider = booking.getProviderId().equals(user.getId());
        boolean isClient = booking.getClientId().equals(user.getId());

        if (!isProvider && !isClient) {
            throw new RuntimeException("Unauthorized to update this booking");
        }

        if (request.getStatus() != null) {
            booking.setStatus(request.getStatus());
            if (request.getStatus() == Booking.BookingStatus.COMPLETED) {
                booking.setCompletedAt(java.time.LocalDateTime.now());
                booking.setPaymentStatus(Booking.PaymentStatus.PAID);

                // Update provider stats
                userRepository.findById(booking.getProviderId()).ifPresent(provider -> {
                    if (provider.getCompletedBookings() == null) provider.setCompletedBookings(0);
                    provider.setCompletedBookings(provider.getCompletedBookings() + 1);
                    userRepository.save(provider);
                });
            }
        }

        if (request.getCancellationReason() != null) {
            booking.setCancellationReason(request.getCancellationReason());
        }
        if (request.getMeetingLink() != null) {
            booking.setMeetingLink(request.getMeetingLink());
        }

        return bookingRepository.save(booking);
    }

    public Page<Booking> getClientBookings(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return bookingRepository.findByClientId(user.getId(), pageable);
    }

    public Page<Booking> getProviderBookings(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return bookingRepository.findByProviderId(user.getId(), pageable);
    }

    public Booking getBookingById(String email, String bookingId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getClientId().equals(user.getId()) && !booking.getProviderId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        return booking;
    }
}
