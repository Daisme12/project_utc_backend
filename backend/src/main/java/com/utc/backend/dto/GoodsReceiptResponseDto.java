package com.utc.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record GoodsReceiptResponseDto(
    Long id,
    String receiptCode,
    SupplierResponseDto supplier,
    UserResponseDto createdBy,
    ProductResponseDto product,
    String batchNumber,
    LocalDate expDate,
    BigDecimal quantity,
    BigDecimal importPrice,
    BigDecimal totalCost,
    String note,
    LocalDateTime createdAt
) {}
