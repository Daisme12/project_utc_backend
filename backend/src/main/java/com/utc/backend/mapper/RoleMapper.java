package com.utc.backend.mapper;

import com.utc.backend.dto.RoleResponseDto;
import com.utc.backend.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public RoleResponseDto toResponseDto(Role role) {
        if (role == null) {
            return null;
        }
        return new RoleResponseDto(
                role.getId(),
                role.getCode(),
                role.getName(),
                role.getCreatedAt()
        );
    }
}
