package com.project.VaultNet.dto.AuthDto;

import com.project.VaultNet.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private UUID id;
    private String username;
    private String email;
    private Role role;

}
