package com.project.VaultNet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChangePinResponse {
    private boolean success;
    private String message;
}
