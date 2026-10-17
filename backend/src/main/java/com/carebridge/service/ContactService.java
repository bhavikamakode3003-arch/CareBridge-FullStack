package com.carebridge.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.carebridge.entity.Contact;
import com.carebridge.repository.ContactRepository;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    // Add Contact Message
    public Contact addContact(Contact contact) {

        contact.setStatus("New");
        contact.setCreatedAt(LocalDateTime.now());

        return contactRepository.save(contact);
    }

    // Get All Messages
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    // Get Message By ID
    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Contact message not found"));
    }

    // Get By Status
    public List<Contact> getContactsByStatus(String status) {
        return contactRepository.findByStatus(status);
    }

    // Update Status
    public Contact updateStatus(Long id, String status) {

        Contact contact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Contact message not found"));

        contact.setStatus(status);

        return contactRepository.save(contact);
    }

    // Delete Message
    public void deleteContact(Long id) {

        Contact contact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Contact message not found"));

        contactRepository.delete(contact);
    }
}