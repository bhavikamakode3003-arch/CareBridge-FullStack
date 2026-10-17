package com.carebridge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carebridge.entity.SpecialOccasion;

public interface SpecialOccasionRepository
        extends JpaRepository<SpecialOccasion, Long> {

    // Particular user ki occasion/visit requests
    List<SpecialOccasion> findByUserId(Long userId);

    // Status ke according requests
    List<SpecialOccasion> findByStatus(String status);

    // Occasion type ke according
    List<SpecialOccasion> findByOccasionType(String occasionType);
}