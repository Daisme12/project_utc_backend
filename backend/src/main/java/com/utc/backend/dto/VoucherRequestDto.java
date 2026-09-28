package com.utc.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VoucherRequestDto(
    @NotBlank(message = "Mã voucher không được để trống")
    String code,

    String badge,

    @NotBlank(message = "Tiêu đề không được để trống")
    String title,

    @NotBlank(message = "Loại giảm giá không được để trống")
    String discountType, // PERCENT hoặc FIXED_AMOUNT

    @NotNull(message = "Giá trị giảm không được để trống")
    BigDecimal discountValue,

    BigDecimal minOrderAmount,

    @NotNull(message = "Ngày bắt đầu không được để trống")
    LocalDateTime startDate,

    @NotNull(message = "Ngày kết thúc không được để trống")
    LocalDateTime endDate,

    Boolean isActive
) {}
