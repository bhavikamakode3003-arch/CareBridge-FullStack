package com.carebridge.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Donor/User ID
    private Long userId;

    // Selected requirement ID (optional)
    @Column(name = "requirement_id")
    private Long requirementId;

    private String fullName;

    private String email;

    private String phone;

    // Money, Clothes, Books, Food, Toys etc.
    private String donationType;

    // For physical donations
    private String quantity;

    // For money donation
    private Double amount;

    private Boolean pickupRequired;

    @Column(length = 1000)
    private String address;

    @Column(length = 1000)
    private String message;

    private String status;

    private LocalDateTime createdAt;
}