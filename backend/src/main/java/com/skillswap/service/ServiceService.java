package com.skillswap.service;

import com.skillswap.dto.ServiceDto;
import com.skillswap.model.User;
import com.skillswap.repository.ServiceRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    public com.skillswap.model.Service createService(String email, ServiceDto.CreateServiceRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getRoles().add(User.Role.ROLE_PROVIDER);
        userRepository.save(user);

        com.skillswap.model.Service service = com.skillswap.model.Service.builder()
                .providerId(user.getId())
                .providerName(user.getName())
                .providerAvatar(user.getAvatar())
                .providerRating(user.getRating())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .subcategory(request.getSubcategory())
                .price(request.getPrice())
                .priceType(request.getPriceType())
                .tags(request.getTags())
                .features(request.getFeatures())
                .deliveryTime(request.getDeliveryTime())
                .location(request.getLocation())
                .isRemote(request.isRemote())
                .images(request.getImages())
                .thumbnail(request.getThumbnail())
                .rating(0.0)
                .reviewCount(0)
                .totalBookings(0)
                .active(true)
                .status(com.skillswap.model.Service.ServiceStatus.ACTIVE)
                .build();

        return serviceRepository.save(service);
    }

    public com.skillswap.model.Service updateService(String email, String serviceId,
                                                      ServiceDto.UpdateServiceRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.skillswap.model.Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (!service.getProviderId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this service");
        }

        if (request.getTitle() != null) service.setTitle(request.getTitle());
        if (request.getDescription() != null) service.setDescription(request.getDescription());
        if (request.getCategory() != null) service.setCategory(request.getCategory());
        if (request.getSubcategory() != null) service.setSubcategory(request.getSubcategory());
        if (request.getPrice() != null) service.setPrice(request.getPrice());
        if (request.getPriceType() != null) service.setPriceType(request.getPriceType());
        if (request.getTags() != null) service.setTags(request.getTags());
        if (request.getFeatures() != null) service.setFeatures(request.getFeatures());
        if (request.getDeliveryTime() != null) service.setDeliveryTime(request.getDeliveryTime());
        if (request.getLocation() != null) service.setLocation(request.getLocation());
        service.setRemote(request.isRemote());
        if (request.getImages() != null) service.setImages(request.getImages());
        if (request.getThumbnail() != null) service.setThumbnail(request.getThumbnail());

        return serviceRepository.save(service);
    }

    public void deleteService(String email, String serviceId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.skillswap.model.Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (!service.getProviderId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this service");
        }

        service.setActive(false);
        service.setStatus(com.skillswap.model.Service.ServiceStatus.DELETED);
        serviceRepository.save(service);
    }

    public com.skillswap.model.Service getServiceById(String id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public Page<com.skillswap.model.Service> getAllServices(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        return serviceRepository.findByActiveTrue(pageable);
    }

    public Page<com.skillswap.model.Service> getServicesByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return serviceRepository.findByCategoryAndActiveTrue(category, pageable);
    }

    public Page<com.skillswap.model.Service> searchServices(String keyword, String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "rating"));
        if (category != null && !category.isEmpty()) {
            return serviceRepository.searchServicesByCategory(category, keyword, pageable);
        }
        return serviceRepository.searchServices(keyword, pageable);
    }

    public List<com.skillswap.model.Service> getProviderServices(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return serviceRepository.findByProviderIdAndActiveTrue(user.getId());
    }

    public List<com.skillswap.model.Service> getPublicProviderServices(String userId) {
        return serviceRepository.findByProviderIdAndActiveTrue(userId);
    }
}
