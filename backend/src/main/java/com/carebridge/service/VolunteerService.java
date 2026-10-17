package com.carebridge.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.carebridge.entity.Volunteer;
import com.carebridge.repository.VolunteerRepository;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    public VolunteerService(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    // Register as Volunteer
    public Volunteer addVolunteer(Volunteer volunteer) {

        if (volunteer.getAge() == null ||
                volunteer.getAge() < 18 ||
                volunteer.getAge() > 35) {
            throw new RuntimeException(
                    "Volunteer age must be between 18 and 35"
            );
        }

        volunteer.setStatus("Pending");
        volunteer.setCreatedAt(LocalDateTime.now());

        return volunteerRepository.save(volunteer);
    }

    // Get All Volunteer Applications
    public List<Volunteer> getAllVolunteers() {
        return volunteerRepository.findAll();
    }

    // Get Volunteer By ID
    public Volunteer getVolunteerById(Long id) {
        return volunteerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Volunteer not found"));
    }

    // Get Applications By User ID
    public List<Volunteer> getVolunteersByUserId(Long userId) {
        return volunteerRepository.findByUserId(userId);
    }

    // Get Applications By Status
    public List<Volunteer> getVolunteersByStatus(String status) {
        return volunteerRepository.findByStatus(status);
    }

    // Get By Volunteer Type
    public List<Volunteer> getVolunteersByType(String volunteerType) {
        return volunteerRepository.findByVolunteerType(volunteerType);
    }

    // Update Volunteer Status
    public Volunteer updateVolunteerStatus(Long id, String status) {

        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Volunteer not found"));

        volunteer.setStatus(status);

        return volunteerRepository.save(volunteer);
    }

    // Delete Volunteer Application
    public void deleteVolunteer(Long id) {

        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Volunteer not found"));

        volunteerRepository.delete(volunteer);
    }
}