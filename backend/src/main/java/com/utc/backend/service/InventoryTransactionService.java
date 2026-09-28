package com.utc.backend.service;

import com.utc.backend.dto.InventoryTransactionResponseDto;

import java.util.List;

public interface InventoryTransactionService {
    List<InventoryTransactionResponseDto> getTransactionsByProduct(Long productId);
    List<InventoryTransactionResponseDto> getTransactionsByType(String type);
}
