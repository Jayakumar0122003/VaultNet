package com.project.VaultNet.service;

import com.project.VaultNet.dto.TransactionDto.TransferByAccountNumRequest;
import com.project.VaultNet.dto.TransactionDto.TransferByAccountNumResponse;
import com.project.VaultNet.dto.TransactionDto.TransferViaCardRequest;
import com.project.VaultNet.dto.TransactionDto.TransferViaCardResponse;
import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.model.Transaction;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.repository.DebitCardRepository;
import com.project.VaultNet.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class TransactionService {

    @Autowired
    DebitCardRepository debitCardRepository;
    @Autowired
    TransactionRepository transactionRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    public TransferByAccountNumResponse transferMoney(TransferByAccountNumRequest request) {
        DebitCard senderCard = debitCardRepository.findByAccountNumber(request.getSenderAccountNumber())
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        DebitCard receiverCard = debitCardRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        if (senderCard.isCardBlocked()) {
            return new TransferByAccountNumResponse(false,"Card is blocked due to multiple failed attempts. Contact support.");
        }

        // Validate PIN
        if (!passwordEncoder.matches(request.getPin(), senderCard.getPinHash())) {
            handleFailedAttempt(senderCard);
            return new TransferByAccountNumResponse(false,"Invalid PIN.") ;
        }

        // Validate balance
        if (senderCard.getBalance().doubleValue() < request.getAmount()) {
            return new TransferByAccountNumResponse(false,"Insufficient balance.");
        }

        // Perform transfer
        senderCard.setBalance(senderCard.getBalance().subtract(
                java.math.BigDecimal.valueOf(request.getAmount())
        ));
        receiverCard.setBalance(receiverCard.getBalance().add(
                java.math.BigDecimal.valueOf(request.getAmount())
        ));

        // Save balances
        debitCardRepository.save(senderCard);
        debitCardRepository.save(receiverCard);

        // Save transaction record
        Transaction transaction = Transaction.builder()
                .sender(senderCard.getUser())
                .receiver(receiverCard.getUser())
                .amount(request.getAmount())
                .transactionDate(new Date())
                .status("SUCCESS")
                .build();
        transactionRepository.save(transaction);

        return new TransferByAccountNumResponse(true,"Transfer successful.");
    }

    public TransferViaCardResponse transferUsingCardDetails(TransferViaCardRequest request) {
        DebitCard senderCard = debitCardRepository.findByCardNumber(request.getCardNumber())
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (senderCard.isCardBlocked()) {
            return new TransferViaCardResponse(false,"Card is blocked due to multiple failed attempts. Contact support.");
        }

        // Validate cardholder info
        if (!senderCard.getCardHolderName().equalsIgnoreCase(request.getCardHolderName())
                || !senderCard.getCvv().equals(request.getCvv())
                || !senderCard.getExpiryDate().equals(request.getExpiryDate())) {
            handleFailedAttempt(senderCard);
            return new TransferViaCardResponse( false,"Card details are incorrect.");
        }

        // Validate PIN
        if (!passwordEncoder.matches(request.getPin(), senderCard.getPinHash())) {
            handleFailedAttempt(senderCard);
            return new TransferViaCardResponse( false,"Invalid PIN.");

        }

        // Validate balance
        if (senderCard.getBalance().doubleValue() < request.getAmount()) {
            return new TransferViaCardResponse( false,"Insufficient balance.");
        }

        // Receiver
        DebitCard receiverCard = debitCardRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        // Transfer
        senderCard.setBalance(senderCard.getBalance().subtract(BigDecimal.valueOf(request.getAmount())));
        receiverCard.setBalance(receiverCard.getBalance().add(BigDecimal.valueOf(request.getAmount())));

        debitCardRepository.save(senderCard);
        debitCardRepository.save(receiverCard);

        // Save transaction
        Transaction transaction = Transaction.builder()
                .sender(senderCard.getUser())
                .receiver(receiverCard.getUser())
                .amount(request.getAmount())
                .transactionDate(new Date())
                .status("SUCCESS")
                .build();
        transactionRepository.save(transaction);

        return new TransferViaCardResponse( true,"Transfer via card successful.");
    }

    private void handleFailedAttempt(DebitCard card) {
        int maxAttempts = 3;

        card.setFailedAttempts(card.getFailedAttempts() + 1);
        if (card.getFailedAttempts() >= maxAttempts) {
            card.setCardBlocked(true);
            card.setBlockedAt(LocalDateTime.now()); // Optional
        }

        debitCardRepository.save(card);
    }


}
