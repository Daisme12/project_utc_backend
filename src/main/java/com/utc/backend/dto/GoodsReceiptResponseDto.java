package com.utc.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record GoodsReceiptResponseDto(
    Long id,
    String receiptCode,
    SupplierResponseDto supplier,
    UserResponseDto createdBy,
    BigDecimal totalCost,
    LocalDateTime createdAt,
    List<GoodsReceiptDetailResponseDto> details
) {}
