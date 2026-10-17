package com.carebridge.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.carebridge.entity.Donation;
import com.carebridge.repository.DonationRepository;

@Service
public class DonationService {

    private final DonationRepository donationRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    // Add Donation
    public Donation addDonation(Donation donation) {
        donation.setStatus("Pending");
        donation.setCreatedAt(LocalDateTime.now());

        return donationRepository.save(donation);
    }

    // Get All Donations
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    // Get Donation By ID
    public Donation getDonationById(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
    }

    // Get Donations By User ID
    public List<Donation> getDonationsByUserId(Long userId) {
        return donationRepository.findByUserId(userId);
    }

    // Get Donations By Requirement ID
    public List<Donation> getDonationsByRequirementId(Long requirementId) {
        return donationRepository.findByRequirementId(requirementId);
    }

    // Get Donations By Status
    public List<Donation> getDonationsByStatus(String status) {
        return donationRepository.findByStatus(status);
    }

    // Update Donation Status
    public Donation updateDonationStatus(Long id, String status) {

        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        donation.setStatus(status);

        return donationRepository.save(donation);
    }

    // Delete Donation
    public void deleteDonation(Long id) {

        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        donationRepository.delete(donation);
    }
}