package com.utc.backend.service.impl;

import com.utc.backend.dto.InventoryTransactionResponseDto;
import com.utc.backend.mapper.InventoryTransactionMapper;
import com.utc.backend.repository.InventoryTransactionRepository;
import com.utc.backend.service.InventoryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryTransactionServiceImpl implements InventoryTransactionService {

    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryTransactionMapper inventoryTransactionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDto> getTransactionsByProduct(Long productId) {
        return inventoryTransactionRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(inventoryTransactionMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDto> getTransactionsByType(String type) {
        return inventoryTransactionRepository.findByType(type).stream()
                .map(inventoryTransactionMapper::toResponseDto)
                .toList();
    }
}
