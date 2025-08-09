package com.project.VaultNet.dto.AuthDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseVerifyOtp {
    private boolean success;
    private String message;
}
