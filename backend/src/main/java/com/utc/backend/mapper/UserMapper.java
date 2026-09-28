package com.utc.backend.mapper;

import com.utc.backend.dto.UserCreateDto;
import com.utc.backend.dto.UserResponseDto;
import com.utc.backend.dto.UserUpdateDto;
import com.utc.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserCreateDto dto) {
        if (dto == null) {
            return null;
        }
        return User.builder()
                .username(dto.username())
                .fullName(dto.fullName())
                .phone(dto.phone())
                .email(dto.email())
                .avatarUrl(dto.avatarUrl())
                .role(dto.role() != null ? dto.role().toUpperCase() : "CUSTOMER")
                .accumulatedPoints(0)
                .isActive(true)
                .build();
    }

    public void updateEntityFromDto(UserUpdateDto dto, User user) {
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
                user.getAvatarUrl(),
                user.getRole(),
                user.getAccumulatedPoints(),
                user.getIsActive(),
                user.getCreatedAt()
        );
    }
}
