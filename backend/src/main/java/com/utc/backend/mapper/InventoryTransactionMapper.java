package com.utc.backend.mapper;

import com.utc.backend.dto.InventoryTransactionResponseDto;
import com.utc.backend.entity.InventoryTransaction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InventoryTransactionMapper {

    private final ProductMapper productMapper;

    public InventoryTransactionResponseDto toResponseDto(InventoryTransaction transaction) {
        if (transaction == null) {
            return null;
        }
        return new InventoryTransactionResponseDto(
                transaction.getId(),
                productMapper.toResponseDto(transaction.getProduct()),
                transaction.getType(),
                transaction.getQuantityDelta(),
                transaction.getBalanceAfter(),
                transaction.getReferenceId(),
                transaction.getCreatedAt()
        );
    }
}
