package com.utc.backend.dto;

public record VnPayPaymentResponseDto(
    String paymentUrl,
    String orderCode,
    String message
) {}
