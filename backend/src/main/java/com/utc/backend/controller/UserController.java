package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.UserCreateDto;
import com.utc.backend.dto.UserResponseDto;
import com.utc.backend.dto.UserUpdateDto;
import com.utc.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponseDto>> createUser(@Valid @RequestBody UserCreateDto dto) {
        UserResponseDto createdUser = userService.createUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdUser, "Tạo người dùng mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDto dto) {
        UserResponseDto updatedUser = userService.updateUser(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Cập nhật thông tin người dùng thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user, "Lấy thông tin người dùng thành công"));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserByUsername(@PathVariable String username) {
        UserResponseDto user = userService.getUserByUsername(username);
        return ResponseEntity.ok(ApiResponse.success(user, "Lấy thông tin người dùng thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllActiveUsers() {
        List<UserResponseDto> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(ApiResponse.success(users, "Lấy danh sách người dùng thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("SUCCESS", "Xóa người dùng thành công"));
    }
}
