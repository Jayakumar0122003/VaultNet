package com.project.VaultNet.dto.cardPinDto;

import lombok.Data;

@Data
public class SetPinRequest {
    private String pin;
    private String lastFourDigits;
}
