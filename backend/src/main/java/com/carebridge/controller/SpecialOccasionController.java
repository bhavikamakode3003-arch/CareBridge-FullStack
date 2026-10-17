package com.carebridge.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carebridge.entity.SpecialOccasion;
import com.carebridge.service.SpecialOccasionService;

@RestController
@RequestMapping("/api/special-occasions")
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "http://localhost:5174",
	    "http://localhost:5175",
	    "http://localhost:5176"
	})
public class SpecialOccasionController {

    private final SpecialOccasionService specialOccasionService;

    public SpecialOccasionController(
            SpecialOccasionService specialOccasionService) {
        this.specialOccasionService = specialOccasionService;
    }

    // Add Special Occasion / Visit Request
    @PostMapping
    public ResponseEntity<SpecialOccasion> addSpecialOccasion(
            @RequestBody SpecialOccasion specialOccasion) {

        SpecialOccasion savedRequest =
                specialOccasionService.addSpecialOccasion(specialOccasion);

        return new ResponseEntity<>(savedRequest, HttpStatus.CREATED);
    }

    // Get All Requests
    @GetMapping
    public ResponseEntity<List<SpecialOccasion>>
            getAllSpecialOccasions() {

        return ResponseEntity.ok(
                specialOccasionService.getAllSpecialOccasions()
        );
    }

    // Get Request By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSpecialOccasionById(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    specialOccasionService.getSpecialOccasionById(id)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get Requests By User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SpecialOccasion>>
            getSpecialOccasionsByUserId(@PathVariable Long userId) {

        return ResponseEntity.ok(
                specialOccasionService
                        .getSpecialOccasionsByUserId(userId)
        );
    }

    // Get Requests By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SpecialOccasion>>
            getSpecialOccasionsByStatus(@PathVariable String status) {

        return ResponseEntity.ok(
                specialOccasionService
                        .getSpecialOccasionsByStatus(status)
        );
    }

    // Get Requests By Occasion Type
    @GetMapping("/type/{occasionType}")
    public ResponseEntity<List<SpecialOccasion>>
            getSpecialOccasionsByType(
                    @PathVariable String occasionType) {

        return ResponseEntity.ok(
                specialOccasionService
                        .getSpecialOccasionsByType(occasionType)
        );
    }

    // Update Request Status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        try {
            String status = request.get("status");

            return ResponseEntity.ok(
                    specialOccasionService.updateStatus(id, status)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete Request
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSpecialOccasion(
            @PathVariable Long id) {

        try {
            specialOccasionService.deleteSpecialOccasion(id);

            return ResponseEntity.ok(
                    "Special occasion request deleted successfully"
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}