package com.project.VaultNet.dto.cardPinDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerifyPinOtpRequest {
    private String otp;
}
