package com.utc.backend.service;

import com.utc.backend.config.JwtTokenProvider;
import com.utc.backend.dto.AuthResponseDto;
import com.utc.backend.dto.LoginRequestDto;
import com.utc.backend.dto.UserResponseDto;
import com.utc.backend.entity.User;
import com.utc.backend.exception.BadRequestException;
import com.utc.backend.mapper.UserMapper;
import com.utc.backend.repository.UserRepository;
import com.utc.backend.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private EmailService emailService;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private UserResponseDto sampleUserDto;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@utc.edu.vn")
                .phone("0988888888")
                .passwordHash("$2a$10$encodedHash123456")
                .role("ADMIN")
                .isActive(true)
                .build();

        sampleUserDto = new UserResponseDto(
                1L, "admin", "Nguyễn Quản Trị", "0988888888", "admin@utc.edu.vn",
                null, "ADMIN", 500, true, null
        );
    }

    @Test
    void loginWithUsernameSuccess() {
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("123456", sampleUser.getPasswordHash())).thenReturn(true);
        when(jwtTokenProvider.generateToken("admin")).thenReturn("mock-jwt-token");
        when(userMapper.toResponseDto(sampleUser)).thenReturn(sampleUserDto);

        AuthResponseDto response = authService.login(new LoginRequestDto("admin", "123456"));

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.accessToken());
        assertEquals("admin", response.user().username());
    }

    @Test
    void loginWithEmailSuccess() {
        when(userRepository.findByUsername("admin@utc.edu.vn")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("admin@utc.edu.vn")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("123456", sampleUser.getPasswordHash())).thenReturn(true);
        when(jwtTokenProvider.generateToken("admin")).thenReturn("mock-jwt-token");
        when(userMapper.toResponseDto(sampleUser)).thenReturn(sampleUserDto);

        AuthResponseDto response = authService.login(new LoginRequestDto("admin@utc.edu.vn", "123456"));

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.accessToken());
    }

    @Test
    void loginWithPhoneSuccess() {
        when(userRepository.findByUsername("0988888888")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("0988888888")).thenReturn(Optional.empty());
        when(userRepository.findByPhone("0988888888")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("123456", sampleUser.getPasswordHash())).thenReturn(true);
        when(jwtTokenProvider.generateToken("admin")).thenReturn("mock-jwt-token");
        when(userMapper.toResponseDto(sampleUser)).thenReturn(sampleUserDto);

        AuthResponseDto response = authService.login(new LoginRequestDto("0988888888", "123456"));

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.accessToken());
    }


    @Test
    void loginWithWrongPasswordThrowsException() {
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpass", sampleUser.getPasswordHash())).thenReturn(false);

        assertThrows(BadRequestException.class, () ->
                authService.login(new LoginRequestDto("admin", "wrongpass"))
        );
    }
}
