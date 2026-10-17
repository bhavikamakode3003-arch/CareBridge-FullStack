package com.carebridge.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carebridge.entity.Requirement;
import com.carebridge.entity.User;
import com.carebridge.repository.DonationRepository;
import com.carebridge.repository.RequirementRepository;
import com.carebridge.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RequirementRepository requirementRepository;
    private final DonationRepository donationRepository;

    public UserService(
            UserRepository userRepository,
            RequirementRepository requirementRepository,
            DonationRepository donationRepository) {

        this.userRepository = userRepository;
        this.requirementRepository = requirementRepository;
        this.donationRepository = donationRepository;
    }

    // ================================
    // REGISTER USER
    // ================================

    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        user.setStatus("Active");
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    // ================================
    // GET ALL USERS
    // ================================

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ================================
    // LOGIN USER
    // ================================

    public User loginUser(
            String email,
            String password,
            String role) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        if (!user.getRole().equalsIgnoreCase(role)) {
            throw new RuntimeException(
                    "Invalid role selected"
            );
        }

        if (!"Active".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException(
                    "Your account is inactive"
            );
        }

        return user;
    }

    // ================================
    // GET USER BY ID
    // ================================

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
    }

    // ================================
    // UPDATE USER
    // ================================

    public User updateUser(
            Long id,
            User updatedUser) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        existingUser.setFullName(
                updatedUser.getFullName()
        );

        existingUser.setEmail(
                updatedUser.getEmail()
        );

        existingUser.setPhone(
                updatedUser.getPhone()
        );

        existingUser.setRole(
                updatedUser.getRole()
        );

        return userRepository.save(existingUser);
    }

    // ================================
    // DELETE USER
    // ================================

    @Transactional
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        /*
         * If the user is an NGO:
         *
         * 1. Find all requirements created by NGO.
         * 2. Delete donations linked to those requirements.
         * 3. Delete NGO requirements.
         *
         * This prevents orphan requirements.
         */
        if ("NGO".equalsIgnoreCase(user.getRole())) {

            List<Requirement> requirements =
                    requirementRepository.findByUserId(id);

            for (Requirement requirement : requirements) {

                donationRepository.deleteByRequirementId(
                        requirement.getId()
                );
            }

            requirementRepository.deleteByUserId(id);
        }

        /*
         * Delete donations made by this user.
         *
         * This mainly applies when a Donor account
         * is deleted.
         */
        donationRepository.deleteByUserId(id);

        /*
         * Finally delete the user.
         */
        userRepository.delete(user);
    }
}