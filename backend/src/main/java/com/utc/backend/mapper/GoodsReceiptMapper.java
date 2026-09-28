package com.utc.backend.mapper;

import com.utc.backend.dto.GoodsReceiptResponseDto;
import com.utc.backend.entity.GoodsReceipt;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GoodsReceiptMapper {

    private final SupplierMapper supplierMapper;
    private final UserMapper userMapper;
    private final ProductMapper productMapper;

    public GoodsReceiptResponseDto toResponseDto(GoodsReceipt receipt) {
        if (receipt == null) {
            return null;
        }
        return new GoodsReceiptResponseDto(
                receipt.getId(),
                receipt.getReceiptCode(),
                supplierMapper.toResponseDto(receipt.getSupplier()),
                userMapper.toResponseDto(receipt.getCreatedBy()),
                productMapper.toResponseDto(receipt.getProduct()),
                receipt.getBatchNumber(),
                receipt.getExpDate(),
                receipt.getQuantity(),
                receipt.getImportPrice(),
                receipt.getTotalCost(),
                receipt.getNote(),
                receipt.getCreatedAt()
        );
    }
}
