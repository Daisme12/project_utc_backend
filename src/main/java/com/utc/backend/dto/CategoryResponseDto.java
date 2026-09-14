package com.utc.backend.dto;

public record CategoryResponseDto(
    Long id,
    String name,
    String slug,
    String description,
    Boolean isActive
) {}
