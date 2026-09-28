package com.utc.backend.service.impl;

import com.utc.backend.config.JwtTokenProvider;
import com.utc.backend.dto.*;
import com.utc.backend.entity.User;
import com.utc.backend.exception.BadRequestException;
import com.utc.backend.exception.ResourceNotFoundException;
import com.utc.backend.mapper.UserMapper;
import com.utc.backend.repository.UserRepository;
import com.utc.backend.service.AuthService;
import com.utc.backend.service.EmailService;
import com.utc.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByUsername(dto.username())
                .orElseThrow(() -> new BadRequestException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(dto.password(), user.getPasswordHash())) {
            throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new BadRequestException("Tài khoản của bạn đã bị khóa");
        }

        String token = jwtTokenProvider.generateToken(user.getUsername());
        UserResponseDto userDto = userMapper.toResponseDto(user);

        return AuthResponseDto.of(token, userDto);
    }

    @Override
    @Transactional
    public AuthResponseDto register(UserCreateDto dto) {
        UserResponseDto userDto = userService.createUser(dto);
        String token = jwtTokenProvider.generateToken(userDto.username());
        return AuthResponseDto.of(token, userDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDto refreshToken(RefreshTokenRequestDto dto) {
        if (!jwtTokenProvider.validateToken(dto.refreshToken())) {
            throw new BadRequestException("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        String username = jwtTokenProvider.getUsernameFromToken(dto.refreshToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        String newToken = jwtTokenProvider.generateToken(user.getUsername());
        UserResponseDto userDto = userMapper.toResponseDto(user);

        return AuthResponseDto.of(newToken, userDto);
    }

    @Override
    public void logout(String token) {
        // Handled on client side by clearing token
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequestDto dto) {
        User user = userRepository.findByUsername(dto.username())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(dto.oldPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Mật khẩu cũ không chính xác");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản liên kết với email: " + email));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15)); // Hiệu lực 15 phút
        userRepository.save(user);

        emailService.sendResetPasswordEmail(user.getEmail(), resetToken);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequestDto dto) {
        User user = userRepository.findByResetToken(dto.resetToken())
                .orElseThrow(() -> new BadRequestException("Mã xác thực reset token không hợp lệ"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            throw new BadRequestException("Mã xác thực reset token đã hết hạn (chỉ có hiệu lực 15 phút)");
        }

        if (!user.getEmail().equalsIgnoreCase(dto.email())) {
            throw new BadRequestException("Email không khớp với mã reset token");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.newPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}
