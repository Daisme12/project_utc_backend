package com.utc.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponseDto(
    Long id,
    CategoryResponseDto category,
    String sku,
    String name,
    String unit,
    Boolean isWeighing,
    BigDecimal price,
    BigDecimal costPrice,
    BigDecimal stockQuantity,
    String origin,
    String imageUrl,
    Boolean isActive,
    LocalDateTime createdAt
) {}
