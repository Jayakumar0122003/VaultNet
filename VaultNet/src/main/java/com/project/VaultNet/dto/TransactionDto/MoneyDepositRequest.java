package com.project.VaultNet.dto.TransactionDto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MoneyDepositRequest {
    private String accountNumber;
    private BigDecimal amount;
}
