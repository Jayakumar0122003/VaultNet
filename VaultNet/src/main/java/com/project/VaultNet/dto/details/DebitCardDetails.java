package com.project.VaultNet.dto.details;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;
@Data
@AllArgsConstructor
public class DebitCardDetails {
    private Long id;
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
}
