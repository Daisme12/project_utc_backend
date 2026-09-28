package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.SupplierRequestDto;
import com.utc.backend.dto.SupplierResponseDto;
import com.utc.backend.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping
    public ResponseEntity<ApiResponse<SupplierResponseDto>> createSupplier(@Valid @RequestBody SupplierRequestDto dto) {
        SupplierResponseDto supplier = supplierService.createSupplier(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(supplier, "Tạo nhà cung cấp mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierResponseDto>> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody SupplierRequestDto dto) {
        SupplierResponseDto supplier = supplierService.updateSupplier(id, dto);
        return ResponseEntity.ok(ApiResponse.success(supplier, "Cập nhật thông tin nhà cung cấp thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierResponseDto>> getSupplierById(@PathVariable Long id) {
        SupplierResponseDto supplier = supplierService.getSupplierById(id);
        return ResponseEntity.ok(ApiResponse.success(supplier, "Lấy thông tin nhà cung cấp thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupplierResponseDto>>> getAllActiveSuppliers() {
        List<SupplierResponseDto> suppliers = supplierService.getAllActiveSuppliers();
        return ResponseEntity.ok(ApiResponse.success(suppliers, "Lấy danh sách nhà cung cấp thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("SUCCESS", "Xóa nhà cung cấp thành công"));
    }
}
