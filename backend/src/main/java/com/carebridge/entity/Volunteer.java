package com.carebridge.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "volunteers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Registered user ID
    private Long userId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;

    private Integer age;

    private String city;

    // Teaching, Event Support, Healthcare etc.
    private String volunteerType;

    // Weekdays, Weekends, Flexible etc.
    private String availability;

    @Column(length = 1000)
    private String experience;

    @Column(length = 1000)
    private String message;

    // Pending / Accepted / Rejected / Completed
    private String status;

    private LocalDateTime createdAt;
}