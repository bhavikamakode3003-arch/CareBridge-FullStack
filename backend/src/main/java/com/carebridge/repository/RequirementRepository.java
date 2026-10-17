package com.carebridge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carebridge.entity.Requirement;

public interface RequirementRepository
        extends JpaRepository<Requirement, Long> {

    List<Requirement> findByStatus(String status);

    List<Requirement> findByUserId(Long userId);

    // Delete all requirements created by a particular NGO
    void deleteByUserId(Long userId);
}