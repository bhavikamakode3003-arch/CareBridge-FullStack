package com.carebridge.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carebridge.entity.Contact;
import com.carebridge.service.ContactService;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "http://localhost:5174",
	    "http://localhost:5175",
	    "http://localhost:5176"
	})
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    // Submit Contact Message
    @PostMapping
    public ResponseEntity<?> addContact(
            @RequestBody Contact contact) {

        try {

            Contact savedContact =
                    contactService.addContact(contact);

            return ResponseEntity.ok(savedContact);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // Get All Messages
    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts() {

        return ResponseEntity.ok(
                contactService.getAllContacts()
        );
    }

    // Get Message By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getContactById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    contactService.getContactById(id)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // Get Messages By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Contact>> getByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                contactService.getContactsByStatus(status)
        );
    }

    // Update Status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        try {

            String status = body.get("status");

            Contact updatedContact =
                    contactService.updateStatus(id, status);

            return ResponseEntity.ok(updatedContact);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // Delete Contact Message
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(
            @PathVariable Long id) {

        try {

            contactService.deleteContact(id);

            return ResponseEntity.ok(
                    "Contact message deleted successfully"
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}