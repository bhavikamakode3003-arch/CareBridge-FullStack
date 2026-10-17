package com.carebridge.service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class RazorpayService {

    // Razorpay Test Keys
   @Value("${RAZORPAY_KEY_ID}")
private String KEY;

@Value("${RAZORPAY_KEY_SECRET}")
private String SECRET;

    public String createOrder(double amount) throws Exception {

        RazorpayClient client = new RazorpayClient(KEY, SECRET);

        JSONObject orderRequest = new JSONObject();

        // Razorpay accepts amount in paise
        orderRequest.put("amount", (int) (amount * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "carebridge_receipt_" + System.currentTimeMillis());

        Order order = client.orders.create(orderRequest);

        return order.toString();
    }
}