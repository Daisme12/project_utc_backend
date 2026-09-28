package com.utc.backend.dto;

import java.time.LocalDateTime;

public record RoleResponseDto(
    Long id,
    String code,
    String name,
    LocalDateTime createdAt
) {}
