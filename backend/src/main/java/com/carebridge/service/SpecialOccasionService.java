package com.carebridge.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.carebridge.entity.SpecialOccasion;
import com.carebridge.repository.SpecialOccasionRepository;

@Service
public class SpecialOccasionService {

    private final SpecialOccasionRepository specialOccasionRepository;

    public SpecialOccasionService(
            SpecialOccasionRepository specialOccasionRepository) {
        this.specialOccasionRepository = specialOccasionRepository;
    }

    // Add Special Occasion / Visit Request
    public SpecialOccasion addSpecialOccasion(
            SpecialOccasion specialOccasion) {

        specialOccasion.setStatus("Pending");
        specialOccasion.setCreatedAt(LocalDateTime.now());

        return specialOccasionRepository.save(specialOccasion);
    }

    // Get All Requests
    public List<SpecialOccasion> getAllSpecialOccasions() {
        return specialOccasionRepository.findAll();
    }

    // Get Request By ID
    public SpecialOccasion getSpecialOccasionById(Long id) {
        return specialOccasionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Special occasion request not found"));
    }

    // Get Requests By User ID
    public List<SpecialOccasion> getSpecialOccasionsByUserId(
            Long userId) {

        return specialOccasionRepository.findByUserId(userId);
    }

    // Get Requests By Status
    public List<SpecialOccasion> getSpecialOccasionsByStatus(
            String status) {

        return specialOccasionRepository.findByStatus(status);
    }

    // Get Requests By Occasion Type
    public List<SpecialOccasion> getSpecialOccasionsByType(
            String occasionType) {

        return specialOccasionRepository
                .findByOccasionType(occasionType);
    }

    // Update Status
    public SpecialOccasion updateStatus(
            Long id, String status) {

        SpecialOccasion specialOccasion =
                specialOccasionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Special occasion request not found"));

        specialOccasion.setStatus(status);

        return specialOccasionRepository.save(specialOccasion);
    }

    // Delete Request
    public void deleteSpecialOccasion(Long id) {

        SpecialOccasion specialOccasion =
                specialOccasionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Special occasion request not found"));

        specialOccasionRepository.delete(specialOccasion);
    }
}