package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.VoucherRequestDto;
import com.utc.backend.dto.VoucherResponseDto;
import com.utc.backend.service.VoucherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/vouchers")
@RequiredArgsConstructor
@Tag(name = "Voucher Management", description = "APIs for managing vouchers and promotional discount codes")
public class VoucherController {

    private final VoucherService voucherService;

    @PostMapping
    @Operation(summary = "Tạo mã khuyến mại mới")
    public ResponseEntity<ApiResponse<VoucherResponseDto>> createVoucher(@Valid @RequestBody VoucherRequestDto dto) {
        VoucherResponseDto response = voucherService.createVoucher(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Tạo mã voucher thành công"));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả voucher đang hoạt động")
    public ResponseEntity<ApiResponse<List<VoucherResponseDto>>> getAllActiveVouchers() {
        List<VoucherResponseDto> response = voucherService.getAllActiveVouchers();
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách voucher thành công"));
    }

    @GetMapping("/{code}")
    @Operation(summary = "Kiểm tra và lấy chi tiết voucher theo mã code")
    public ResponseEntity<ApiResponse<VoucherResponseDto>> getVoucherByCode(@PathVariable String code) {
        VoucherResponseDto response = voucherService.getVoucherByCode(code);
        return ResponseEntity.ok(ApiResponse.success(response, "Áp dụng mã voucher hợp lệ"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Vô hiệu hóa voucher")
    public ResponseEntity<ApiResponse<Void>> deleteVoucher(@PathVariable Long id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Vô hiệu hóa voucher thành công"));
    }
}
