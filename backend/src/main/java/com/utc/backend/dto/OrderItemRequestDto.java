package com.utc.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record OrderItemRequestDto(
    @NotNull(message = "Sản phẩm không được để trống")
    Long productId,

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 200, message = "Tên sản phẩm tối đa 200 ký tự")
    String productName,

    @NotBlank(message = "Đơn vị tính không được để trống")
    @Size(max = 20, message = "Đơn vị tính tối đa 20 ký tự")
    String unit,

    @NotNull(message = "Số lượng mua không được để trống")
    @Positive(message = "Số lượng mua phải lớn hơn 0")
    BigDecimal quantity,

    @NotNull(message = "Đơn giá không được để trống")
    @PositiveOrZero(message = "Đơn giá phải lớn hơn hoặc bằng 0")
    BigDecimal unitPrice
) {}
