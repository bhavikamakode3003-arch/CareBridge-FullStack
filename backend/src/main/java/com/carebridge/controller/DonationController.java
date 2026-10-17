package com.carebridge.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carebridge.entity.Donation;
import com.carebridge.service.DonationService;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "http://localhost:5174",
	    "http://localhost:5175",
	    "http://localhost:5176"
	})
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    // Add Donation
    @PostMapping
    public ResponseEntity<Donation> addDonation(
            @RequestBody Donation donation) {

        Donation savedDonation = donationService.addDonation(donation);

        return new ResponseEntity<>(savedDonation, HttpStatus.CREATED);
    }

    // Get All Donations
    @GetMapping
    public ResponseEntity<List<Donation>> getAllDonations() {

        return ResponseEntity.ok(
                donationService.getAllDonations()
        );
    }

    // Get Donation By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDonationById(@PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    donationService.getDonationById(id)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get Donations By User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Donation>> getDonationsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                donationService.getDonationsByUserId(userId)
        );
    }

    // Get Donations By Requirement ID
    @GetMapping("/requirement/{requirementId}")
    public ResponseEntity<List<Donation>> getDonationsByRequirementId(
            @PathVariable Long requirementId) {

        return ResponseEntity.ok(
                donationService.getDonationsByRequirementId(requirementId)
        );
    }

    // Get Donations By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Donation>> getDonationsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                donationService.getDonationsByStatus(status)
        );
    }

    // Update Donation Status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDonationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        try {
            String status = request.get("status");

            return ResponseEntity.ok(
                    donationService.updateDonationStatus(id, status)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete Donation
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonation(@PathVariable Long id) {

        try {
            donationService.deleteDonation(id);
            return ResponseEntity.ok("Donation deleted successfully");

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

//POST   /api/donations
//GET    /api/donations
//GET    /api/donations/{id}
//GET    /api/donations/user/{userId}
//GET    /api/donations/requirement/{requirementId}
//GET    /api/donations/status/{status}
//PUT    /api/donations/{id}/status
//DELETE /api/donations/{id}