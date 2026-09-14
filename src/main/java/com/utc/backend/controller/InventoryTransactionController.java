package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.InventoryTransactionResponseDto;
import com.utc.backend.service.InventoryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/inventory-transactions")
@RequiredArgsConstructor
public class InventoryTransactionController {

    private final InventoryTransactionService inventoryTransactionService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<InventoryTransactionResponseDto>>> getTransactionsByProduct(@PathVariable Long productId) {
        List<InventoryTransactionResponseDto> transactions = inventoryTransactionService.getTransactionsByProduct(productId);
        return ResponseEntity.ok(ApiResponse.success(transactions, "Lấy lịch sử biến động tồn kho sản phẩm thành công"));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<InventoryTransactionResponseDto>>> getTransactionsByType(@PathVariable String type) {
        List<InventoryTransactionResponseDto> transactions = inventoryTransactionService.getTransactionsByType(type);
        return ResponseEntity.ok(ApiResponse.success(transactions, "Lấy lịch sử biến động kho theo loại xuất/nhập thành công"));
    }
}
