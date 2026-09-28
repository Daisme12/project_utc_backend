package com.utc.backend.service.impl;

import com.utc.backend.dto.HealthResponseDto;
import com.utc.backend.service.HealthService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class HealthServiceImpl implements HealthService {

    @Override
    public HealthResponseDto getHealthStatus() {
        return new HealthResponseDto(
                "UP",
                "ProjectBackEndUTC",
                "1.0.0-SNAPSHOT",
                LocalDateTime.now()
        );
    }
}
