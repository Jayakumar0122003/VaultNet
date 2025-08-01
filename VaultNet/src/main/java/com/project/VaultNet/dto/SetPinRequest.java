package com.project.VaultNet.dto;

import lombok.Data;

@Data
public class SetPinRequest {
    private String pin;
    private String lastFourDigits;
}
