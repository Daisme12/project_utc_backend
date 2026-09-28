package com.utc.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequestDto(
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    String email,

    @NotBlank(message = "Mã xác thực reset token không được để trống")
    String resetToken,

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Size(min = 6, message = "Mật khẩu mới phải từ 6 ký tự trở lên")
    String newPassword
) {}
