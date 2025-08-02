package com.project.VaultNet.dto.TransactionDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MoneyDepositResponse {
    private boolean success;
    private String message;
}
