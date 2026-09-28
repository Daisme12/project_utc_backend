package com.utc.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VoucherResponseDto(
    Long id,
    String code,
    String badge,
    String title,
    String discountType,
    BigDecimal discountValue,
    BigDecimal minOrderAmount,
    LocalDateTime startDate,
    LocalDateTime endDate,
    Boolean isActive,
    LocalDateTime createdAt
) {}
