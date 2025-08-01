package com.project.VaultNet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SetPinResponse {
    private boolean success;
    private String message;
}
