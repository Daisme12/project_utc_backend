package com.utc.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record GoodsReceiptRequestDto(
    @NotBlank(message = "Mã phiếu nhập không được để trống")
    @Size(max = 30, message = "Mã phiếu nhập tối đa 30 ký tự")
    String receiptCode,

    @NotNull(message = "Nhà cung cấp không được để trống")
    Long supplierId,

    @NotEmpty(message = "Danh sách chi tiết phiếu nhập không được rỗng")
    @Valid
    List<GoodsReceiptDetailRequestDto> details
) {}
