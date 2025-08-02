package com.project.VaultNet.service;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String verificationLink, String name);
    void sendOtpForgotPin(String toEmail, String otp, String name);
}
