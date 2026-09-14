package com.utc.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequestDto(
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên danh mục tối đa 100 ký tự")
    String name,

    @NotBlank(message = "Slug danh mục không được để trống")
    @Size(max = 120, message = "Slug tối đa 120 ký tự")
    String slug,

    String description,

    Boolean isActive
) {}
