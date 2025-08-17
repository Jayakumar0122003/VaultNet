package com.project.VaultNet.model;

public enum TransactionType {
    DEBIT,   // Money sent to someone else
    CREDIT,  // Money received from others
    DEPOSIT  // Money added by user to their own account
}