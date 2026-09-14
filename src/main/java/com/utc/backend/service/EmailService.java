package com.utc.backend.service;

public interface EmailService {
    void sendResetPasswordEmail(String toEmail, String resetToken);
}
