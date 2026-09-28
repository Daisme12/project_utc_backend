package com.utc.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoodsReceiptRequestDto(
    String receiptCode,

    @NotNull(message = "Nhà cung cấp không được để trống")
    Long supplierId,

    @NotNull(message = "Sản phẩm nhập không được để trống")
    Long productId,

    String batchNumber,

    LocalDate expDate,

    @NotNull(message = "Số lượng nhập không được để trống")
    @DecimalMin(value = "0.001", message = "Số lượng phải lớn hơn 0")
    BigDecimal quantity,

    @NotNull(message = "Giá nhập không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá nhập phải lớn hơn 0")
    BigDecimal importPrice,

    String note
) {}
