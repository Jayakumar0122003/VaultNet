package com.project.VaultNet.dto.AccountCreation;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccountCreationResponse {
    private boolean success;
    private String message;
}

