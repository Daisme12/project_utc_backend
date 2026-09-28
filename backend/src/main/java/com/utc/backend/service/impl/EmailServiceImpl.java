package com.utc.backend.service.impl;

import com.utc.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendResetPasswordEmail(String toEmail, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Yêu cầu Reset Mật khẩu - UTC Backend");
        message.setText("Bạn nhận được email này vì đã yêu cầu cấp lại mật khẩu.\n\n" +
                "Mã Reset Token của bạn là: " + resetToken + "\n\n" +
                "Mã này sẽ hết hạn sau 15 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            // Log mail sending error gracefully
            System.err.println("Gửi mail reset thất bại: " + e.getMessage());
        }
    }
}
