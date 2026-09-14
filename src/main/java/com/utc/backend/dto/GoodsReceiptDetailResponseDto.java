package com.utc.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoodsReceiptDetailResponseDto(
    Long id,
    ProductResponseDto product,
    String batchNumber,
    LocalDate expDate,
    BigDecimal quantity,
    BigDecimal importPrice
) {}
