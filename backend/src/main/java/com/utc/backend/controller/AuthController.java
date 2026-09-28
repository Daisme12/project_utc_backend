package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.*;
import com.utc.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@Valid @RequestBody LoginRequestDto dto) {
        AuthResponseDto response = authService.login(dto);
        return ResponseEntity.ok(ApiResponse.success(response, "Đăng nhập thành công"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDto>> register(@Valid @RequestBody UserCreateDto dto) {
        AuthResponseDto response = authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Đăng ký tài khoản thành công"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponseDto>> refreshToken(@Valid @RequestBody RefreshTokenRequestDto dto) {
        AuthResponseDto response = authService.refreshToken(dto);
        return ResponseEntity.ok(ApiResponse.success(response, "Làm mới JWT Token thành công"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestHeader(value = "Authorization", required = false) String token) {
        authService.logout(token);
        return ResponseEntity.ok(ApiResponse.success("SUCCESS", "Đăng xuất thành công"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@Valid @RequestBody ChangePasswordRequestDto dto) {
        authService.changePassword(dto);
        return ResponseEntity.ok(ApiResponse.success("SUCCESS", "Đổi mật khẩu thành công"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestParam("email") String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponse.success("SUCCESS", "Mã xác nhận cấp lại mật khẩu đã được gửi đến email của bạn"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequestDto dto) {
        authService.resetPassword(dto);
        return ResponseEntity.ok(ApiResponse.success("SUCCESS", "Đặt lại mật khẩu mới thành công"));
    }
}
