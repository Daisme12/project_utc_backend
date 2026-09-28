package com.utc.backend.dto;

public record AuthResponseDto(
    String accessToken,
    String tokenType,
    UserResponseDto user
) {
    public static AuthResponseDto of(String accessToken, UserResponseDto user) {
        return new AuthResponseDto(accessToken, "Bearer", user);
    }
}
