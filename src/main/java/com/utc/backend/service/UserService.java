package com.utc.backend.service;

import com.utc.backend.dto.UserCreateDto;
import com.utc.backend.dto.UserResponseDto;
import com.utc.backend.dto.UserUpdateDto;

import java.util.List;

public interface UserService {
    UserResponseDto createUser(UserCreateDto dto);
    UserResponseDto updateUser(Long id, UserUpdateDto dto);
    UserResponseDto getUserById(Long id);
    UserResponseDto getUserByUsername(String username);
    List<UserResponseDto> getAllActiveUsers();
    void deleteUser(Long id);
}
