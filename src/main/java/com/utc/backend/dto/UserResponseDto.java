package com.utc.backend.dto;

import java.time.LocalDateTime;

public record UserResponseDto(
    Long id,
    String username,
    String fullName,
    String phone,
    String email,
    Boolean isActive,
    RoleResponseDto role,
    LocalDateTime createdAt
) {}
