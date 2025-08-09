package com.project.VaultNet.dto.AuthDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerifyOtp {
    private String email;
    private String otp;
}
