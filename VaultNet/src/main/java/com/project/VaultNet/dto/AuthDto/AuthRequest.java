package com.project.VaultNet.dto.AuthDto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
