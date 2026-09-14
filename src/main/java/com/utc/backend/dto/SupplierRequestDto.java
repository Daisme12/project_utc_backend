package com.utc.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupplierRequestDto(
    @NotBlank(message = "Tên nhà cung cấp không được để trống")
    @Size(max = 150, message = "Tên nhà cung cấp tối đa 150 ký tự")
    String name,

    @Size(max = 15, message = "Số điện thoại tối đa 15 ký tự")
    String phone,

    @Size(max = 255, message = "Địa chỉ tối đa 255 ký tự")
    String address,

    Boolean isActive
) {}
