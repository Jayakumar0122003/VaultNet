package com.project.VaultNet.service;

import com.project.VaultNet.customexceptions.ResourceNotFoundException;
import com.project.VaultNet.customexceptions.TransactionLimitExceededException;
import com.project.VaultNet.dto.TransactionDto.*;
import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.model.Transaction;
import com.project.VaultNet.model.TransactionType;
import com.project.VaultNet.repository.DebitCardRepository;
import com.project.VaultNet.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    @Transactional
    public TransferByAccountNumResponse transferMoney(TransferByAccountNumRequest request) {
        // Fetch sender and receiver
        DebitCard senderCard = debitCardRepository.findByAccountNumber(request.getSenderAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Sender account not found!"));

        DebitCard receiverCard = debitCardRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver account not found!"));

        // Block check
        if (senderCard.isCardBlocked()) {
            return new TransferByAccountNumResponse(false,
                    "Card is blocked due to multiple failed attempts. Contact support!");
        }

        // PIN check
        if (!passwordEncoder.matches(request.getPin(), senderCard.getPinHash())) {
            handleFailedAttempt(senderCard);
            return new TransferByAccountNumResponse(false, "Please check your PIN!");
        }

        BigDecimal transferAmount = BigDecimal.valueOf(request.getAmount());

        // Limit check
        try {
            validateTransactionLimit(senderCard, transferAmount);
        } catch (TransactionLimitExceededException e) {
            return new TransferByAccountNumResponse(false, e.getMessage());
        }

        // Balance check
        if (transferAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return new TransferByAccountNumResponse(false, "Transfer amount must be greater than zero.");
        }

        if (senderCard.getBalance() == null || senderCard.getBalance().compareTo(transferAmount) < 0) {
            return new TransferByAccountNumResponse(false, "Insufficient funds in your account.");
        }

        // Perform transfer
        senderCard.setBalance(senderCard.getBalance().subtract(transferAmount));
        receiverCard.setBalance(receiverCard.getBalance().add(transferAmount));

        senderCard.setCardBlocked(false);
        senderCard.setBlockedAt(null);
        senderCard.setFailedAttempts(0);

        debitCardRepository.save(senderCard);
        debitCardRepository.save(receiverCard);

        // Record transaction
        recordTransaction(senderCard, receiverCard, transferAmount);

        return new TransferByAccountNumResponse(true, "Transfer successful!");
    }


    private void recordTransaction(DebitCard sender, DebitCard receiver, BigDecimal amount) {
        LocalDateTime now = LocalDateTime.now();

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setTimestamp(now);
        transaction.setSender(sender);
        transaction.setReceiver(receiver);

        // Determine type
        if (sender.getId().equals(receiver.getId())) {
            transaction.setType(TransactionType.DEPOSIT);
            transaction.setDescription("Money Deposited");
        } else {
            transaction.setType(TransactionType.DEBIT);
            transaction.setDescription("Transfer to " + receiver.getAccountNumber());
        }

        transactionRepository.save(transaction);
    }



    // ====================================
    // Transfer via Card Details
    // ====================================
    @Transactional
    public TransferViaCardResponse transferUsingCardDetails(TransferViaCardRequest request) {
        try {
            // Fetch sender card
            DebitCard senderCard = debitCardRepository.findByCardNumber(request.getCardNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Sender card not found!"));

            // Block check
            if (senderCard.isCardBlocked()) {
                return new TransferViaCardResponse(false,
                        "Card is blocked due to multiple failed attempts. Contact support!");
            }

            // Validate card details
            if (!senderCard.getCardHolderName().equalsIgnoreCase(request.getCardHolderName())
                    || !senderCard.getCvv().equals(request.getCvv())
                    || !senderCard.getExpiryDate().equals(request.getExpiryDate())) {
                handleFailedAttempt(senderCard);
                return new TransferViaCardResponse(false, "Card details are incorrect!");
            }

            // PIN check
            if (!passwordEncoder.matches(request.getPin(), senderCard.getPinHash())) {
                handleFailedAttempt(senderCard);
                return new TransferViaCardResponse(false, "Please check your PIN!");
            }

            BigDecimal transferAmount = BigDecimal.valueOf(request.getAmount());

            // Limit check
            try {
                validateTransactionLimit(senderCard, transferAmount);
            } catch (TransactionLimitExceededException e) {
                return new TransferViaCardResponse(false, e.getMessage());
            }

            // Balance check
            if (transferAmount.compareTo(BigDecimal.ZERO) <= 0) {
                return new TransferViaCardResponse(false, "Transfer amount must be greater than zero.");
            }

            if (senderCard.getBalance() == null || senderCard.getBalance().compareTo(transferAmount) < 0) {
                return new TransferViaCardResponse(false, "Insufficient funds in your account.");
            }

            // Fetch receiver card
            DebitCard receiverCard = debitCardRepository.findByAccountNumber(request.getReceiverAccountNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Receiver account not found!"));

            // Perform transfer
            senderCard.setBalance(senderCard.getBalance().subtract(BigDecimal.valueOf(request.getAmount())));
            receiverCard.setBalance(receiverCard.getBalance().add(BigDecimal.valueOf(request.getAmount())));
            senderCard.setCardBlocked(false);
            senderCard.setBlockedAt(null);
            senderCard.setFailedAttempts(0);
            debitCardRepository.save(senderCard);
            debitCardRepository.save(receiverCard);

            // Record transactions
            recordTransactionCard(senderCard, receiverCard, BigDecimal.valueOf(request.getAmount()));

            return new TransferViaCardResponse(true, "Transfer via card successful!");

        } catch (ResourceNotFoundException e) {
            throw e; // handled globally → 404
        } catch (Exception e) {
            throw new RuntimeException("Failed to transfer via card. Please try again later.", e);
        }
    }

    private void recordTransactionCard(DebitCard sender, DebitCard receiver, BigDecimal amount) {
        LocalDateTime now = LocalDateTime.now();

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setTimestamp(now);
        transaction.setSender(sender);
        transaction.setReceiver(receiver);

        // Determine type
        if (sender.getId().equals(receiver.getId())) {
            transaction.setType(TransactionType.DEPOSIT);
            transaction.setDescription("Money Deposited");
        } else {
            transaction.setType(TransactionType.DEBIT);
            transaction.setDescription("Transfer to " + receiver.getAccountNumber());
        }

        transactionRepository.save(transaction);
    }



    // ====================================
    // Handle Failed Attempt
    // ====================================
    private void handleFailedAttempt(DebitCard card) {
        try {
            int maxAttempts = 7;

            card.setFailedAttempts(card.getFailedAttempts() + 1);

            if (card.getFailedAttempts() >= maxAttempts) {
                card.setCardBlocked(true);
                card.setBlockedAt(LocalDateTime.now());
            }

            debitCardRepository.save(card);

        } catch (Exception e) {
            // Log the error but do not propagate it to avoid breaking the main flow
            System.err.println("Error handling failed attempt for card "
                    + card.getCardNumber() + ": " + e.getMessage());
        }
    }


    // ====================================
    // Validate Daily Transaction Limit
    // ====================================
    public void validateTransactionLimit(DebitCard card, BigDecimal transactionAmount) {
        try {
            LocalDate today = LocalDate.now();

            if (card.getLastTransactionDate() == null || !card.getLastTransactionDate().isEqual(today)) {
                // Reset daily total for new day
                card.setTodayTransactionTotal(BigDecimal.ZERO);
                card.setLastTransactionDate(today);
            }

            BigDecimal newTotal = card.getTodayTransactionTotal().add(transactionAmount);

            if (newTotal.compareTo(card.getDailyTransactionLimit()) > 0) {
                throw new TransactionLimitExceededException("Daily transaction limit exceeded.");
            }

            // Update total for today
            card.setTodayTransactionTotal(newTotal);
            card.setLastTransactionDate(today);
            debitCardRepository.save(card);

        } catch (TransactionLimitExceededException e) {
            throw e; // propagate for global handling → 400 Bad Request
        } catch (Exception e) {
            // Unexpected DB or other errors
            throw new RuntimeException("Failed to validate transaction limit. Please try again later.", e);
        }
    }


    // ====================================
    // Scheduled: Reset Daily Transaction Totals
    // ====================================
    @Scheduled(cron = "0 0 0 * * *") // every day at midnight
    public void resetDailyTransactionLimits() {
        try {
            List<DebitCard> cards = debitCardRepository.findAll();

            for (DebitCard card : cards) {
                try {
                    card.setTodayTransactionTotal(BigDecimal.ZERO);
                    card.setLastTransactionDate(LocalDate.now());
                    debitCardRepository.save(card);
                } catch (Exception e) {
                    // Log failure for this card but continue with others
                    System.err.println("Failed to reset daily limit for card "
                            + card.getCardNumber() + ": " + e.getMessage());
                }
            }

            System.out.println("Daily transaction limits reset successfully for all cards.");

        } catch (Exception e) {
            // Log unexpected errors in fetching cards
            System.err.println("Failed to reset daily transaction limits: " + e.getMessage());
        }
    }

    public MoneyDepositResponse depositMoney(MoneyDepositRequest request) {
        try {
            DebitCard card = debitCardRepository.findByAccountNumber(request.getAccountNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found!"));

            // Update balance
            card.setBalance(card.getBalance().add(request.getAmount()));
            debitCardRepository.save(card);

            // Record deposit transaction
            Transaction depositTxn = new Transaction();
            depositTxn.setAmount(request.getAmount());
            depositTxn.setTimestamp(LocalDateTime.now());
            depositTxn.setType(TransactionType.DEPOSIT); // use DEPOSIT type
            depositTxn.setDescription("Money Deposited");
            depositTxn.setSender(card);
            depositTxn.setReceiver(card);
            transactionRepository.save(depositTxn);

            return new MoneyDepositResponse(true, "Successfully Deposited!");

        } catch (ResourceNotFoundException e) {
            throw e; // propagate for controller → 404 Not Found
        } catch (Exception e) {
            System.err.println("Failed to deposit money: " + e.getMessage());
            throw new RuntimeException("Unable to deposit money. Please try again later.", e);
        }
    }



    public MoneyWithdrawResponse withdrawMoney(MoneyWithdrawRequest request) {
        try {
            DebitCard card = debitCardRepository.findByAccountNumber(request.getAccountNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid Account Number"));

            // Check if card is blocked
            if (card.isCardBlocked()) {
                return new MoneyWithdrawResponse(false,
                        "Card is blocked due to multiple failed attempts. Contact support.");
            }

            // PIN verification
            if (!passwordEncoder.matches(request.getPin(), card.getPinHash())) {
                handleFailedAttempt(card);
                return new MoneyWithdrawResponse(false, "Please provide valid PIN!");
            }

            // Balance check
            if (card.getBalance().compareTo(request.getAmount()) < 0) {
                return new MoneyWithdrawResponse(false, "Insufficient funds.");
            }

            // Daily limit check
            validateTransactionLimit(card, request.getAmount());

            // Perform withdrawal
            card.setBalance(card.getBalance().subtract(request.getAmount()));
            debitCardRepository.save(card);

            // Record transaction
            Transaction withdrawalTxn = new Transaction();
            withdrawalTxn.setAmount(request.getAmount());
            withdrawalTxn.setTimestamp(LocalDateTime.now());
            withdrawalTxn.setType(TransactionType.DEBIT); // Money sent from user's account
            withdrawalTxn.setDescription("Money Withdrawn");
            withdrawalTxn.setSender(card);
            withdrawalTxn.setReceiver(card); // For withdrawals, sender = receiver
            transactionRepository.save(withdrawalTxn);

            return new MoneyWithdrawResponse(true, "Money withdrawal successful");

        } catch (ResourceNotFoundException e) {
            throw e; // propagate for controller → 404 Not Found
        } catch (Exception e) {
            System.err.println("Failed to withdraw money: " + e.getMessage());
            throw new RuntimeException("Unable to withdraw money. Please try again later.", e);
        }
    }

    public List<Transaction> getUserDebits(Long cardId) {
        return transactionRepository.findUserDebits(cardId, TransactionType.DEBIT);
    }

    public List<Transaction> getUserCredits(Long cardId) {
        return transactionRepository.findUserCredits(cardId, TransactionType.CREDIT, TransactionType.DEPOSIT);
    }

    public List<Transaction> getFullHistory(Long cardId) {
        return transactionRepository.findFullHistory(cardId);
    }

}
