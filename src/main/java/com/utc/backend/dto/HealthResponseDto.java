package com.utc.backend.dto;

import java.time.LocalDateTime;

public record HealthResponseDto(
        String status,
        String appName,
        String version,
        LocalDateTime timestamp
) {}
