package com.utc.backend.dto;

import java.math.BigDecimal;

public record OrderItemResponseDto(
    Long id,
    ProductResponseDto product,
    String productName,
    String unit,
    BigDecimal quantity,
    BigDecimal unitPrice,
    BigDecimal subtotal
) {}
