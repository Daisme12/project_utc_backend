package com.utc.backend.dto;

public record SupplierResponseDto(
    Long id,
    String name,
    String phone,
    String address,
    Boolean isActive
) {}
