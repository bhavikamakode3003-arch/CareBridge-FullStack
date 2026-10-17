package com.carebridge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carebridge.entity.Volunteer;

public interface VolunteerRepository
        extends JpaRepository<Volunteer, Long> {

    // Particular user ki volunteer applications
    List<Volunteer> findByUserId(Long userId);

    // Status ke according applications
    List<Volunteer> findByStatus(String status);

    // Volunteer type ke according
    List<Volunteer> findByVolunteerType(String volunteerType);
}