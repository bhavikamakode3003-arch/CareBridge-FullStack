package com.carebridge.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.carebridge.entity.Requirement;
import com.carebridge.repository.RequirementRepository;

@Service
public class RequirementService {

    private final RequirementRepository requirementRepository;

    public RequirementService(RequirementRepository requirementRepository) {
        this.requirementRepository = requirementRepository;
    }

    // Add Requirement
    public Requirement addRequirement(Requirement requirement) {

        requirement.setStatus("Active");
        requirement.setCreatedAt(LocalDateTime.now());
        requirement.setUpdatedAt(LocalDateTime.now());

        return requirementRepository.save(requirement);
    }

    // Get All Requirements
    public List<Requirement> getAllRequirements() {
        return requirementRepository.findAll();
    }

    // Get Requirement By ID
    public Requirement getRequirementById(Long id) {
        return requirementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requirement not found"));
    }

    // Get Requirements By User ID
    public List<Requirement> getRequirementsByUserId(Long userId) {
        return requirementRepository.findByUserId(userId);
    }

    // Get Active Requirements
    public List<Requirement> getActiveRequirements() {
        return requirementRepository.findByStatus("Active");
    }

    // Update Requirement
    public Requirement updateRequirement(Long id, Requirement updatedRequirement) {

        Requirement existingRequirement = requirementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requirement not found"));

        existingRequirement.setOrganization(updatedRequirement.getOrganization());
        existingRequirement.setTitle(updatedRequirement.getTitle());
        existingRequirement.setCategory(updatedRequirement.getCategory());
        existingRequirement.setQuantity(updatedRequirement.getQuantity());
        existingRequirement.setLocation(updatedRequirement.getLocation());
        existingRequirement.setDescription(updatedRequirement.getDescription());

        existingRequirement.setUpdatedAt(LocalDateTime.now());

        return requirementRepository.save(existingRequirement);
    }

    // Delete Requirement
    public void deleteRequirement(Long id) {

        Requirement requirement = requirementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requirement not found"));

        requirementRepository.delete(requirement);
    }
}