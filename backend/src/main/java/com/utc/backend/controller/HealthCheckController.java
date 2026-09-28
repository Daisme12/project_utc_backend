package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.HealthResponseDto;
import com.utc.backend.service.HealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/health")
@RequiredArgsConstructor
public class HealthCheckController {

    private final HealthService healthService;

    @GetMapping
    public ResponseEntity<ApiResponse<HealthResponseDto>> checkHealth() {
        HealthResponseDto health = healthService.getHealthStatus();
        return ResponseEntity.ok(ApiResponse.success(health, "Server is running smoothly"));
    }
}
