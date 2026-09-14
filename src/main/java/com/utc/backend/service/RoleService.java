package com.utc.backend.service;

import com.utc.backend.dto.RoleResponseDto;

import java.util.List;

public interface RoleService {
    List<RoleResponseDto> getAllRoles();
    RoleResponseDto getRoleByCode(String code);
}
