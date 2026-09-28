package com.utc.backend.service;

import com.utc.backend.dto.*;

public interface AuthService {
    AuthResponseDto login(LoginRequestDto dto);
    AuthResponseDto register(UserCreateDto dto);
    AuthResponseDto refreshToken(RefreshTokenRequestDto dto);
    void logout(String token);
    void changePassword(ChangePasswordRequestDto dto);
    void forgotPassword(String email);
    void resetPassword(ResetPasswordRequestDto dto);
}
