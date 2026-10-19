package com.skillswap.controller;

import com.skillswap.dto.ServiceDto;
import com.skillswap.model.Service;
import com.skillswap.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<Page<Service>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        return ResponseEntity.ok(serviceService.getAllServices(page, size, sortBy));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<Service>> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(serviceService.getServicesByCategory(category, page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Service>> searchServices(
            @RequestParam String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(serviceService.searchServices(keyword, category, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable String id) {
        try {
            Service service = serviceService.getServiceById(id);
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/my-services")
    public ResponseEntity<List<Service>> getMyServices(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(serviceService.getProviderServices(userDetails.getUsername()));
    }

    @GetMapping("/provider/{userId}")
    public ResponseEntity<List<Service>> getProviderServices(@PathVariable String userId) {
        return ResponseEntity.ok(serviceService.getPublicProviderServices(userId));
    }

    @PostMapping
    public ResponseEntity<?> createService(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody ServiceDto.CreateServiceRequest request) {
        try {
            Service service = serviceService.createService(userDetails.getUsername(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(service);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable String id,
                                            @RequestBody ServiceDto.UpdateServiceRequest request) {
        try {
            Service service = serviceService.updateService(userDetails.getUsername(), id, request);
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable String id) {
        try {
            serviceService.deleteService(userDetails.getUsername(), id);
            return ResponseEntity.ok(Map.of("message", "Service deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
