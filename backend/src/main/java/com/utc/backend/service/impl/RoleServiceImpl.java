package com.utc.backend.service.impl;

import com.utc.backend.dto.RoleResponseDto;
import com.utc.backend.entity.Role;
import com.utc.backend.exception.ResourceNotFoundException;
import com.utc.backend.mapper.RoleMapper;
import com.utc.backend.repository.RoleRepository;
import com.utc.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponseDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponseDto getRoleByCode(String code) {
        Role role = roleRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với mã: " + code));
        return roleMapper.toResponseDto(role);
    }
}
