package com.carebridge.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carebridge.entity.Volunteer;
import com.carebridge.service.VolunteerService;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "http://localhost:5174",
	    "http://localhost:5175",
	    "http://localhost:5176"
	})
public class VolunteerController {

    private final VolunteerService volunteerService;

    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    // Register as Volunteer
    @PostMapping
    public ResponseEntity<?> addVolunteer(
            @RequestBody Volunteer volunteer) {

        try {
            Volunteer savedVolunteer =
                    volunteerService.addVolunteer(volunteer);

            return new ResponseEntity<>(
                    savedVolunteer,
                    HttpStatus.CREATED
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get All Volunteers
    @GetMapping
    public ResponseEntity<List<Volunteer>> getAllVolunteers() {
        return ResponseEntity.ok(
                volunteerService.getAllVolunteers()
        );
    }

    // Get Volunteer By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getVolunteerById(@PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    volunteerService.getVolunteerById(id)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get Volunteers By User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Volunteer>> getVolunteersByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                volunteerService.getVolunteersByUserId(userId)
        );
    }

    // Get Volunteers By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Volunteer>> getVolunteersByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                volunteerService.getVolunteersByStatus(status)
        );
    }

    // Get Volunteers By Type
    @GetMapping("/type/{volunteerType}")
    public ResponseEntity<List<Volunteer>> getVolunteersByType(
            @PathVariable String volunteerType) {

        return ResponseEntity.ok(
                volunteerService.getVolunteersByType(volunteerType)
        );
    }

    // Update Volunteer Status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateVolunteerStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        try {
            String status = request.get("status");

            return ResponseEntity.ok(
                    volunteerService.updateVolunteerStatus(id, status)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete Volunteer
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVolunteer(@PathVariable Long id) {

        try {
            volunteerService.deleteVolunteer(id);

            return ResponseEntity.ok(
                    "Volunteer application deleted successfully"
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

//POST   /api/volunteers
//GET    /api/volunteers
//GET    /api/volunteers/{id}
//GET    /api/volunteers/user/{userId}
//GET    /api/volunteers/status/{status}
//GET    /api/volunteers/type/{volunteerType}
//PUT    /api/volunteers/{id}/status
//DELETE /api/volunteers/{id}