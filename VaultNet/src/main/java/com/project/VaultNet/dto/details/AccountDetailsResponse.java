package com.project.VaultNet.dto.details;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AccountDetailsResponse {
    private Long id;
    private String accountNumber;
    private String cardHolderName;
    private BigDecimal balance;
    private LocalDateTime issuedAt;
    private boolean pinSet;
}
