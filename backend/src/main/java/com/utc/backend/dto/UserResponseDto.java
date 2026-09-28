package com.utc.backend.dto;

import java.time.LocalDateTime;

public record UserResponseDto(
    Long id,
    String username,
    String fullName,
    String phone,
    String email,
    String avatarUrl,
    String role,
    Integer accumulatedPoints,
    Boolean isActive,
    LocalDateTime createdAt
) {}
