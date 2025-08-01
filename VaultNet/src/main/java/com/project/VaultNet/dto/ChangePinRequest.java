package com.project.VaultNet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ChangePinRequest {
    private String email;
    private String oldPin;
    private String newPin;
}
