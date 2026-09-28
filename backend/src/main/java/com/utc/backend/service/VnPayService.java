package com.utc.backend.service;

import com.utc.backend.dto.VnPayPaymentResponseDto;
import jakarta.servlet.http.HttpServletRequest;

public interface VnPayService {
    VnPayPaymentResponseDto createPaymentUrl(Long orderId, HttpServletRequest request);
    boolean processCallback(HttpServletRequest request);
}
