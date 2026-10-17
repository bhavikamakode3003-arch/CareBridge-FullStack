package com.carebridge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carebridge.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByStatus(String status);
}