package com.carebridge.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity  // database create honga
@Table(name = "users")  //mysql table name
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id  // Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //id automatic generate hogi
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(nullable = false)
    private String role;

    private String status = "Active";

    private LocalDateTime createdAt = LocalDateTime.now();
}