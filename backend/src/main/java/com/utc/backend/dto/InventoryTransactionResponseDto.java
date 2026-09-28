package com.utc.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InventoryTransactionResponseDto(
    Long id,
    ProductResponseDto product,
    String type,
    BigDecimal quantityDelta,
    BigDecimal balanceAfter,
    String referenceId,
    LocalDateTime createdAt
) {}
