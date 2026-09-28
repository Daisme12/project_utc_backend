package com.utc.backend.mapper;

import com.utc.backend.dto.UserCreateDto;
import com.utc.backend.dto.UserResponseDto;
import com.utc.backend.dto.UserUpdateDto;
import com.utc.backend.entity.Role;
import com.utc.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final RoleMapper roleMapper;

    public User toEntity(UserCreateDto dto, Role role) {
        if (dto == null) {
            return null;
        }
        return User.builder()
                .username(dto.username())
                .fullName(dto.fullName())
                .phone(dto.phone())
                .email(dto.email())
                .role(role)
                .isActive(true)
                .build();
    }

    public void updateEntityFromDto(UserUpdateDto dto, User user, Role role) {
        if (dto == null || user == null) {
            return;
        }
        if (dto.fullName() != null) {
            user.setFullName(dto.fullName());
        }
        if (dto.phone() != null) {
            user.setPhone(dto.phone());
        }
        if (dto.email() != null) {
            user.setEmail(dto.email());
        }
        if (dto.isActive() != null) {
            user.setIsActive(dto.isActive());
        }
        if (role != null) {
            user.setRole(role);
        }
    }

    public UserResponseDto toResponseDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getPhone(),
                user.getEmail(),
                user.getIsActive(),
                roleMapper.toResponseDto(user.getRole()),
                user.getCreatedAt()
        );
    }
}
