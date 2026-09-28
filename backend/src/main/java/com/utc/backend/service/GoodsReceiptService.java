package com.utc.backend.service;

import com.utc.backend.dto.GoodsReceiptRequestDto;
import com.utc.backend.dto.GoodsReceiptResponseDto;

import java.util.List;

public interface GoodsReceiptService {
    GoodsReceiptResponseDto createGoodsReceipt(GoodsReceiptRequestDto dto, Long createdByUserId);
    GoodsReceiptResponseDto getGoodsReceiptById(Long id);
    GoodsReceiptResponseDto getGoodsReceiptByCode(String receiptCode);
    List<GoodsReceiptResponseDto> getAllGoodsReceipts();
}
