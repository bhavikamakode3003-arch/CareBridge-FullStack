package com.carebridge.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carebridge.service.RazorpayService;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "http://localhost:5174",
	    "http://localhost:5175",
	    "http://localhost:5176"
	})
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam double amount) {

        try {

            if (amount <= 0) {
                return ResponseEntity
                        .badRequest()
                        .body("Amount must be greater than 0");
            }

            String order = razorpayService.createOrder(amount);

            return ResponseEntity.ok(order);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Unable to create Razorpay order");
        }
    }
}