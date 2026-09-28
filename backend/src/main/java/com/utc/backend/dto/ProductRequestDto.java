package com.utc.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequestDto(
    @NotNull(message = "Danh mục sản phẩm không được để trống")
    Long categoryId,

    @NotBlank(message = "Mã SKU không được để trống")
    @Size(max = 50, message = "Mã SKU tối đa 50 ký tự")
    String sku,

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 200, message = "Tên sản phẩm tối đa 200 ký tự")
    String name,

    @Size(max = 20, message = "Đơn vị tính tối đa 20 ký tự")
    String unit,

    Boolean isWeighing,

    @NotNull(message = "Giá bán không được để trống")
    @PositiveOrZero(message = "Giá bán phải lớn hơn hoặc bằng 0")
    BigDecimal price,

    @PositiveOrZero(message = "Giá vốn phải lớn hơn hoặc bằng 0")
    BigDecimal costPrice,

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @PositiveOrZero(message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    BigDecimal stockQuantity,

    @Size(max = 150, message = "Xuất xứ tối đa 150 ký tự")
    String origin,

    @Size(max = 500, message = "URL hình ảnh tối đa 500 ký tự")
    String imageUrl,

    Boolean isActive
) {}
