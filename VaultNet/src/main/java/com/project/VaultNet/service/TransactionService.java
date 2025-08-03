package com.project.VaultNet.service;

import com.project.VaultNet.dto.TransactionDto.*;
import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.model.Transaction;
import com.project.VaultNet.repository.DebitCardRepository;
import com.project.VaultNet.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    @Autowired
    DebitCardRepository debitCardRepository;

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    // ====================================
    // Transfer by Account Number
    // ====================================
    public TransferByAccountNumResponse transferMoney(TransferByAccountNumRequest request) {
        DebitCard senderCard = debitCardRepository.findByAccountNumber(request.getSenderAccountNumber())
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        DebitCard receiverCard = debitCardRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        // Block check
        if (senderCard.isCardBlocked()) {
            return new TransferByAccountNumResponse(false, "Card is blocked due to multiple failed attempts. Contact support.");
        }

        // Limit check
        validateTransactionLimit(senderCard, BigDecimal.valueOf(request.getAmount()));

        // PIN check
        if (!passwordEncoder.matches(request.getPin(), senderCard.getPinHash())) {
            handleFailedAttempt(senderCard);
            return new TransferByAccountNumResponse(false, "Invalid PIN.");
        }

        // Balance check
        if (senderCard.getBalance().doubleValue() < request.getAmount()) {
            return new TransferByAccountNumResponse(false, "Insufficient balance.");
        }

        // Perform transfer
        senderCard.setBalance(senderCard.getBalance().subtract(BigDecimal.valueOf(request.getAmount())));
        receiverCard.setBalance(receiverCard.getBalance().add(BigDecimal.valueOf(request.getAmount())));

        debitCardRepository.save(senderCard);
        debitCardRepository.save(receiverCard);

        // Record transaction
        Transaction debitTxn = new Transaction();
        debitTxn.setAmount(BigDecimal.valueOf(request.getAmount()));
        debitTxn.setTimestamp(LocalDateTime.now());
        debitTxn.setType("DEBIT");
        debitTxn.setDescription("Transfer to " + request.getReceiverAccountNumber());
        debitTxn.setSender(senderCard);
        debitTxn.setReceiver(receiverCard);
        transactionRepository.save(debitTxn);

        // Save CREDIT transaction
        Transaction creditTxn = new Transaction();
        creditTxn.setAmount(BigDecimal.valueOf(request.getAmount()));
        creditTxn.setTimestamp(LocalDateTime.now());
        creditTxn.setType("CREDIT");
        creditTxn.setDescription("Received from " + request.getSenderAccountNumber());
        creditTxn.setSender(senderCard);
        creditTxn.setReceiver(receiverCard);
        transactionRepository.save(creditTxn);

        return new TransferByAccountNumResponse(true, "Transfer successful.");
    }

    // ====================================
    // Transfer via Card Details
    // ====================================
    public TransferViaCardResponse transferUsingCardDetails(TransferViaCardRequest request) {
        DebitCard senderCard = debitCardRepository.findByCardNumber(request.getCardNumber())
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (senderCard.isCardBlocked()) {
            return new TransferViaCardResponse(false, "Card is blocked due to multiple failed attempts. Contact support.");
        }

        // Validate card details
        if (!senderCard.getCardHolderName().equalsIgnoreCase(request.getCardHolderName())
                || !senderCard.getCvv().equals(request.getCvv())
                || !senderCard.getExpiryDate().equals(request.getExpiryDate())) {
            handleFailedAttempt(senderCard);
            return new TransferViaCardResponse(false, "Card details are incorrect.");
        }

        // PIN check
        if (!passwordEncoder.matches(request.getPin(), senderCard.getPinHash())) {
            handleFailedAttempt(senderCard);
            return new TransferViaCardResponse(false, "Invalid PIN.");
        }

        // Balance check
        if (senderCard.getBalance().doubleValue() < request.getAmount()) {
            return new TransferViaCardResponse(false, "Insufficient balance.");
        }

        // Limit check
        validateTransactionLimit(senderCard, BigDecimal.valueOf(request.getAmount()));

        // Find receiver
        DebitCard receiverCard = debitCardRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        // Perform transfer
        senderCard.setBalance(senderCard.getBalance().subtract(BigDecimal.valueOf(request.getAmount())));
        receiverCard.setBalance(receiverCard.getBalance().add(BigDecimal.valueOf(request.getAmount())));

        debitCardRepository.save(senderCard);
        debitCardRepository.save(receiverCard);

        // Record transaction
        Transaction debitTxn = new Transaction();
        debitTxn.setAmount(BigDecimal.valueOf(request.getAmount()));
        debitTxn.setTimestamp(LocalDateTime.now());
        debitTxn.setType("DEBIT");
        debitTxn.setDescription("Transfer to " + request.getReceiverAccountNumber());
        debitTxn.setSender(senderCard);
        debitTxn.setReceiver(receiverCard);
        transactionRepository.save(debitTxn);

        // Save CREDIT transaction
        Transaction creditTxn = new Transaction();
        creditTxn.setAmount(BigDecimal.valueOf(request.getAmount()));
        creditTxn.setTimestamp(LocalDateTime.now());
        creditTxn.setType("CREDIT");
        creditTxn.setDescription("Received from " + senderCard.getAccountNumber());
        creditTxn.setSender(senderCard);
        creditTxn.setReceiver(receiverCard);
        transactionRepository.save(creditTxn);

        return new TransferViaCardResponse(true, "Transfer via card successful.");
    }

    // ====================================
    // Handle Failed Attempt
    // ====================================
    private void handleFailedAttempt(DebitCard card) {
        int maxAttempts = 5;

        card.setFailedAttempts(card.getFailedAttempts() + 1);
        if (card.getFailedAttempts() >= maxAttempts) {
            card.setCardBlocked(true);
            card.setBlockedAt(LocalDateTime.now());
        }

        debitCardRepository.save(card);
    }

    // ====================================
    // Validate Daily Transaction Limit
    // ====================================
    public void validateTransactionLimit(DebitCard card, BigDecimal transactionAmount) {
        LocalDate today = LocalDate.now();

        if (card.getLastTransactionDate() == null || !card.getLastTransactionDate().isEqual(today)) {
            // Reset for new day
            card.setTodayTransactionTotal(BigDecimal.ZERO);
            card.setLastTransactionDate(today);
        }

        BigDecimal newTotal = card.getTodayTransactionTotal().add(transactionAmount);

        if (newTotal.compareTo(card.getDailyTransactionLimit()) > 0) {
            throw new RuntimeException("Daily transaction limit exceeded.");
        }

        // Update total for today
        card.setTodayTransactionTotal(newTotal);
        card.setLastTransactionDate(today);
        debitCardRepository.save(card);
    }

    // ====================================
    // Scheduled: Reset Daily Transaction Totals
    // ====================================
    @Scheduled(cron = "0 0 0 * * *") // every day at midnight
    public void resetDailyTransactionLimits() {
        List<DebitCard> cards = debitCardRepository.findAll();
        for (DebitCard card : cards) {
            card.setTodayTransactionTotal(BigDecimal.ZERO);
            card.setLastTransactionDate(LocalDate.now());
            debitCardRepository.save(card);
        }
    }

    public MoneyDepositResponse depositMoney(MoneyDepositRequest request) {
        DebitCard card = debitCardRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Card not found"));

        card.setBalance(card.getBalance().add(request.getAmount()));
        debitCardRepository.save(card);

        Transaction creditTxn = new Transaction();
        creditTxn.setAmount(request.getAmount());
        creditTxn.setTimestamp(LocalDateTime.now());
        creditTxn.setType("CREDIT");
        creditTxn.setDescription("Money Deposited From You");
        creditTxn.setSender(card);
        creditTxn.setReceiver(card);
        transactionRepository.save(creditTxn);

        return new MoneyDepositResponse(true, "Successfully Deposited!");
    }

    public MoneyWithdrawResponse withdrawMoney(MoneyWithdrawRequest request) {
        DebitCard card = debitCardRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Invalid Account Number"));

        if (card.isCardBlocked()) {
            return new MoneyWithdrawResponse(false, "Card is blocked due to multiple failed attempts. Contact support.");
        }

        if (!passwordEncoder.matches(request.getPin(), card.getPinHash())) {
            handleFailedAttempt(card);
            return new MoneyWithdrawResponse(false, "Invalid Pin");
        }

        if (card.getBalance().compareTo(request.getAmount()) < 0) {
            return new MoneyWithdrawResponse(false, "Insufficient balance.");
        }

        // Limit check
        validateTransactionLimit(card, request.getAmount());


        card.setBalance(card.getBalance().subtract(request.getAmount()));
        debitCardRepository.save(card);

        Transaction debitTxn = new Transaction();
        debitTxn.setAmount(request.getAmount());
        debitTxn.setTimestamp(LocalDateTime.now());
        debitTxn.setType("DEBIT");
        debitTxn.setDescription("Money Withdraw From You");
        debitTxn.setSender(card);
        debitTxn.setReceiver(card);
        transactionRepository.save(debitTxn);
        return new MoneyWithdrawResponse(true, "Money Withdraw Successful");
    }

    public List<Transaction> getDebitTransactions(Long userId) {
        return transactionRepository.findBySenderIdAndType(userId, "DEBIT");
    }

    public List<Transaction> getCreditTransactions(Long userId) {
        return transactionRepository.findByReceiverIdAndType(userId, "CREDIT");
    }

    public List<Transaction> getAllTransactionsForUser(Long userId) {
        return transactionRepository.findBySenderIdOrReceiverId(userId, userId);
    }
}
