package com.carebridge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carebridge.entity.Donation;

public interface DonationRepository
        extends JpaRepository<Donation, Long> {

    // Particular donor ki donations
    List<Donation> findByUserId(Long userId);

    // Particular requirement ke donations
    List<Donation> findByRequirementId(Long requirementId);

    // Status ke according donations
    List<Donation> findByStatus(String status);

    // Delete donations made by a particular donor
    void deleteByUserId(Long userId);

    // Delete donations linked with a particular requirement
    void deleteByRequirementId(Long requirementId);
}