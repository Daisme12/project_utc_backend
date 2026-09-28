package com.utc.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDto(
    Long id,
    String orderCode,
    String channel,
    UserResponseDto user,
    UserResponseDto cashier,
    String customerName,
    String customerPhone,
    String shippingAddress,
    BigDecimal totalAmount,
    BigDecimal discountAmount,
    BigDecimal finalAmount,
    BigDecimal paidAmount,
    BigDecimal changeAmount,
    String paymentMethod,
    String paymentStatus,
    String orderStatus,
    Boolean isPrinted,
    LocalDateTime printedAt,
    LocalDateTime createdAt,
    List<OrderItemResponseDto> items
) {}
