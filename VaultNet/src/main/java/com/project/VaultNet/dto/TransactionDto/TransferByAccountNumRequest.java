package com.project.VaultNet.dto.TransactionDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TransferByAccountNumRequest {
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private double amount;
    private String pin;
}
