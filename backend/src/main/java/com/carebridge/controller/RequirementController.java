package com.carebridge.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carebridge.entity.Requirement;
import com.carebridge.service.RequirementService;

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "http://localhost:5174",
	    "http://localhost:5175",
	    "http://localhost:5176"
	})
public class RequirementController {

    private final RequirementService requirementService;

    public RequirementController(RequirementService requirementService) {
        this.requirementService = requirementService;
    }

    // Add Requirement
    @PostMapping
    public ResponseEntity<Requirement> addRequirement(
            @RequestBody Requirement requirement) {

        Requirement savedRequirement =
                requirementService.addRequirement(requirement);

        return new ResponseEntity<>(savedRequirement, HttpStatus.CREATED);
    }

    // Get All Requirements
    @GetMapping
    public ResponseEntity<List<Requirement>> getAllRequirements() {
        return ResponseEntity.ok(
                requirementService.getAllRequirements()
        );
    }

    // Get Requirement By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequirementById(@PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    requirementService.getRequirementById(id)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get Requirements Posted By Particular User / NGO
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Requirement>>
            getRequirementsByUserId(@PathVariable Long userId) {

        return ResponseEntity.ok(
                requirementService.getRequirementsByUserId(userId)
        );
    }

    // Get Active Requirements
    @GetMapping("/active")
    public ResponseEntity<List<Requirement>> getActiveRequirements() {

        return ResponseEntity.ok(
                requirementService.getActiveRequirements()
        );
    }

    // Update Requirement
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequirement(
            @PathVariable Long id,
            @RequestBody Requirement requirement) {

        try {
            return ResponseEntity.ok(
                    requirementService.updateRequirement(id, requirement)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete Requirement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequirement(@PathVariable Long id) {

        try {
            requirementService.deleteRequirement(id);
            return ResponseEntity.ok("Requirement deleted successfully");

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}