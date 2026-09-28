package com.utc.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponseDto(
    Long id,
    CategoryResponseDto category,
    String sku,
    String slug,
    String name,
    String brand,
    String origin,
    String standard,
    String unit,
    String packWeight,
    BigDecimal price,
    BigDecimal originalPrice,
    BigDecimal stockQuantity,
    Boolean isWeighing,
    BigDecimal rating,
    Integer reviewCount,
    String imageUrl,
    Boolean isActive,
    LocalDateTime createdAt
) {}
