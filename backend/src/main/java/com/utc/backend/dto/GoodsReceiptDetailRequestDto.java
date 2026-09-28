package com.utc.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoodsReceiptDetailRequestDto(
    @NotNull(message = "Sản phẩm không được để trống")
    Long productId,

    @Size(max = 50, message = "Số lô tối đa 50 ký tự")
    String batchNumber,

    LocalDate expDate,

    @NotNull(message = "Số lượng nhập không được để trống")
    @Positive(message = "Số lượng nhập phải lớn hơn 0")
    BigDecimal quantity,

    @NotNull(message = "Giá nhập không được để trống")
    @PositiveOrZero(message = "Giá nhập phải lớn hơn hoặc bằng 0")
    BigDecimal importPrice
) {}
