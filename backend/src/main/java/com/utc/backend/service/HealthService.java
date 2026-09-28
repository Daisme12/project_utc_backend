package com.utc.backend.service;

import com.utc.backend.dto.HealthResponseDto;

public interface HealthService {
    HealthResponseDto getHealthStatus();
}
