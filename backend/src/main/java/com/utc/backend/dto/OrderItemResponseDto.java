package com.utc.backend.dto;

import java.math.BigDecimal;

public record OrderItemResponseDto(
    Long id,
    Long productId,
    String productName,
    String packWeight,
    String unit,
    BigDecimal quantity,
    BigDecimal unitPrice,
    BigDecimal subtotal,
    String imageUrl
) {}
