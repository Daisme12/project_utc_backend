package com.utc.backend.dto;

public record CategoryResponseDto(
    Long id,
    String name,
    String slug,
    String icon,
    String description,
    Integer displayOrder,
    Boolean isActive
) {}
