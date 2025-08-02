package com.project.VaultNet.dto.details;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DebitCardDetailsRequest {
    private String lastFourDigitsPhone;
}
