package com.utc.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequestDto(
    @NotBlank(message = "Refresh token không được để trống")
    String refreshToken
) {}
