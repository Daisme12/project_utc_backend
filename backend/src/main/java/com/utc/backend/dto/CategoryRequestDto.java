package com.utc.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequestDto(
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên danh mục không quá 100 ký tự")
    String name,

    String slug,
    String icon,
    String description,
    Integer displayOrder,
    Boolean isActive
) {}
