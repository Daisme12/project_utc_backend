package com.utc.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderVoucherResponseDto(
    Long id,
    Long voucherId,
    String voucherCode,
    BigDecimal discountAmount,
    LocalDateTime appliedAt
) {}
