package com.project.VaultNet.dto.TransactionDto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MoneyWithdrawRequest {
    private String pin;
    private BigDecimal amount;
    private String accountNumber;
}
