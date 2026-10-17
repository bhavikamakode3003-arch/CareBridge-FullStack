package com.carebridge.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "requirements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false)
    private String organization;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    private String quantity;

    private String location;

    @Column(length = 1000)
    private String description;

    /*
     * Stores either:
     * 1. Normal image URL
     * OR
     * 2. Selected image converted into Base64/Data URL
     */
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}