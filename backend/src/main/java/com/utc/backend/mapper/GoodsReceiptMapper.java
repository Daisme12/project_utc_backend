package com.utc.backend.mapper;

import com.utc.backend.dto.GoodsReceiptDetailResponseDto;
import com.utc.backend.dto.GoodsReceiptResponseDto;
import com.utc.backend.entity.GoodsReceipt;
import com.utc.backend.entity.GoodsReceiptDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class GoodsReceiptMapper {

    private final SupplierMapper supplierMapper;
    private final UserMapper userMapper;
    private final ProductMapper productMapper;

    public GoodsReceiptDetailResponseDto toDetailResponseDto(GoodsReceiptDetail detail) {
        if (detail == null) {
            return null;
        }
        return new GoodsReceiptDetailResponseDto(
                detail.getId(),
                productMapper.toResponseDto(detail.getProduct()),
                detail.getBatchNumber(),
                detail.getExpDate(),
                detail.getQuantity(),
                detail.getImportPrice()
        );
    }

    public GoodsReceiptResponseDto toResponseDto(GoodsReceipt receipt, List<GoodsReceiptDetail> details) {
        if (receipt == null) {
            return null;
        }
        List<GoodsReceiptDetailResponseDto> detailDtos = details != null ?
                details.stream().map(this::toDetailResponseDto).toList() : Collections.emptyList();

        return new GoodsReceiptResponseDto(
                receipt.getId(),
                receipt.getReceiptCode(),
                supplierMapper.toResponseDto(receipt.getSupplier()),
                userMapper.toResponseDto(receipt.getCreatedBy()),
                receipt.getTotalCost(),
                receipt.getCreatedAt(),
                detailDtos
        );
    }
}
