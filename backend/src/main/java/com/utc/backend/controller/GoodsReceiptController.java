package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.GoodsReceiptRequestDto;
import com.utc.backend.dto.GoodsReceiptResponseDto;
import com.utc.backend.service.GoodsReceiptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/goods-receipts")
@RequiredArgsConstructor
public class GoodsReceiptController {

    private final GoodsReceiptService goodsReceiptService;

    @PostMapping
    public ResponseEntity<ApiResponse<GoodsReceiptResponseDto>> createGoodsReceipt(
            @Valid @RequestBody GoodsReceiptRequestDto dto,
            @RequestParam("createdByUserId") Long createdByUserId) {
        GoodsReceiptResponseDto receipt = goodsReceiptService.createGoodsReceipt(dto, createdByUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(receipt, "Tạo phiếu nhập kho mới thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GoodsReceiptResponseDto>> getGoodsReceiptById(@PathVariable Long id) {
        GoodsReceiptResponseDto receipt = goodsReceiptService.getGoodsReceiptById(id);
        return ResponseEntity.ok(ApiResponse.success(receipt, "Lấy thông tin phiếu nhập kho thành công"));
    }

    @GetMapping("/code/{receiptCode}")
    public ResponseEntity<ApiResponse<GoodsReceiptResponseDto>> getGoodsReceiptByCode(@PathVariable String receiptCode) {
        GoodsReceiptResponseDto receipt = goodsReceiptService.getGoodsReceiptByCode(receiptCode);
        return ResponseEntity.ok(ApiResponse.success(receipt, "Lấy thông tin phiếu nhập kho thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GoodsReceiptResponseDto>>> getAllGoodsReceipts() {
        List<GoodsReceiptResponseDto> receipts = goodsReceiptService.getAllGoodsReceipts();
        return ResponseEntity.ok(ApiResponse.success(receipts, "Lấy danh sách tất cả phiếu nhập kho thành công"));
    }
}
