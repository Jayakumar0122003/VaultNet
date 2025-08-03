package com.project.VaultNet.dto.ChangeEmail;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpRequest {
    private String newPhoneNumber;
    private String otp;
}
