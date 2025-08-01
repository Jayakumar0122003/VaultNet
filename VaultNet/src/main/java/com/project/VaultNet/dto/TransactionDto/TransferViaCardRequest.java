package com.project.VaultNet.dto.TransactionDto;

import lombok.Data;

@Data
public class TransferViaCardRequest {
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
    private String cvv;
    private String pin;
    private String receiverAccountNumber;
    private double amount;
}
