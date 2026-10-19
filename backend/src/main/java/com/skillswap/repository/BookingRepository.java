package com.skillswap.repository;

import com.skillswap.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    Page<Booking> findByClientId(String clientId, Pageable pageable);
    Page<Booking> findByProviderId(String providerId, Pageable pageable);
    List<Booking> findByClientIdAndStatus(String clientId, Booking.BookingStatus status);
    List<Booking> findByProviderIdAndStatus(String providerId, Booking.BookingStatus status);
    boolean existsByClientIdAndServiceIdAndStatus(String clientId, String serviceId, Booking.BookingStatus status);
    long countByProviderId(String providerId);
    long countByProviderIdAndStatus(String providerId, Booking.BookingStatus status);
    long countByClientId(String clientId);
}
