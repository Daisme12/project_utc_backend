package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.RoleResponseDto;
import com.utc.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponseDto>>> getAllRoles() {
        List<RoleResponseDto> roles = roleService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.success(roles, "Lấy danh sách vai trò thành công"));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<RoleResponseDto>> getRoleByCode(@PathVariable String code) {
        RoleResponseDto role = roleService.getRoleByCode(code);
        return ResponseEntity.ok(ApiResponse.success(role, "Lấy thông tin vai trò thành công"));
    }
}
