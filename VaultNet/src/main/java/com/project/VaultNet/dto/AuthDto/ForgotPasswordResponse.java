package com.project.VaultNet.dto.AuthDto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ForgotPasswordResponse {
    private boolean success;
    private String message;
}
