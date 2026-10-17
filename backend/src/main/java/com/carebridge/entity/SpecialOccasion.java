package com.carebridge.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "special_occasions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecialOccasion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;

    // Birthday, Anniversary, Memorial etc.
    private String occasionType;

    private LocalDate occasionDate;

    // Orphanage, Old Age Home, NGO etc.
    private String organizationType;

    private Integer visitors;

    // Food, Clothes, Books, Money etc.
    private String donationType;

    // Morning, Afternoon, Evening
    private String preferredTime;

    @Column(length = 1000)
    private String purpose;

    // Pending / Approved / Rejected / Completed
    private String status;

    private LocalDateTime createdAt;
}