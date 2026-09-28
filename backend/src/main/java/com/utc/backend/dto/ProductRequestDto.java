package com.utc.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequestDto(
    @NotNull(message = "Danh mục không được để trống")
    Long categoryId,

    @NotBlank(message = "Mã SKU không được để trống")
    @Size(max = 50, message = "Mã SKU không quá 50 ký tự")
    String sku,

    String slug,

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 200, message = "Tên sản phẩm không quá 200 ký tự")
    String name,

    String brand,
    String origin,
    String standard, // vietgap, organic, euchill, oxyfresh

    @NotBlank(message = "Đơn vị tính không được để trống")
    @Size(max = 30, message = "Đơn vị tính không quá 30 ký tự")
    String unit,

    String packWeight,

    Boolean isWeighing,

    @NotNull(message = "Giá bán không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá bán phải lớn hơn 0")
    BigDecimal price,

    BigDecimal originalPrice,

    BigDecimal stockQuantity,

    String imageUrl,

    Boolean isActive
) {}
