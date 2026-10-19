package com.skillswap.repository;

import com.skillswap.model.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends MongoRepository<Service, String> {
    Page<Service> findByActiveTrue(Pageable pageable);
    Page<Service> findByCategoryAndActiveTrue(String category, Pageable pageable);
    Page<Service> findByProviderIdAndActiveTrue(String providerId, Pageable pageable);
    List<Service> findByProviderIdAndActiveTrue(String providerId);

    @Query("{ 'active': true, $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } }, { 'tags': { $regex: ?0, $options: 'i' } } ] }")
    Page<Service> searchServices(String keyword, Pageable pageable);

    @Query("{ 'active': true, 'category': ?0, $or: [ { 'title': { $regex: ?1, $options: 'i' } }, { 'description': { $regex: ?1, $options: 'i' } } ] }")
    Page<Service> searchServicesByCategory(String category, String keyword, Pageable pageable);

    long countByProviderIdAndActiveTrue(String providerId);
}
