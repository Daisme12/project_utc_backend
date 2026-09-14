package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.VnPayPaymentResponseDto;
import com.utc.backend.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/payment")
@RequiredArgsConstructor
public class VnPayController {

    private final VnPayService vnPayService;

    @GetMapping("/vnpay/create-payment/{orderId}")
    public ResponseEntity<ApiResponse<VnPayPaymentResponseDto>> createPayment(
            @PathVariable Long orderId,
            HttpServletRequest request) {
        VnPayPaymentResponseDto response = vnPayService.createPaymentUrl(orderId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo đường dẫn thanh toán VNPAY thành công"));
    }

    @GetMapping("/vnpay-callback")
    public ResponseEntity<ApiResponse<String>> processCallback(HttpServletRequest request) {
        boolean isSuccess = vnPayService.processCallback(request);
        if (isSuccess) {
            return ResponseEntity.ok(ApiResponse.success("SUCCESS", "Thanh toán đơn hàng qua VNPAY thành công"));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Thanh toán đơn hàng qua VNPAY thất bại hoặc bị hủy"));
        }
    }
}
