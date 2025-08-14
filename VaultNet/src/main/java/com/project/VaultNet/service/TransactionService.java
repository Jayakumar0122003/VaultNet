package com.project.VaultNet.service;

import com.project.VaultNet.customexceptions.ResourceNotFoundException;
import com.project.VaultNet.customexceptions.TransactionLimitExceededException;
import com.project.VaultNet.dto.TransactionDto.*;
import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.model.Transaction;
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

        Transaction debitTxn = new Transaction();
        debitTxn.setAmount(amount);
        debitTxn.setTimestamp(now);
        debitTxn.setType("DEBIT");
        debitTxn.setDescription("Transfer to " + receiver.getAccountNumber());
        debitTxn.setSender(sender);
        debitTxn.setReceiver(receiver);
        transactionRepository.save(debitTxn);

        Transaction creditTxn = new Transaction();
        creditTxn.setAmount(amount);
        creditTxn.setTimestamp(now);
        creditTxn.setType("CREDIT");
        creditTxn.setDescription("Received from " + sender.getAccountNumber());
        creditTxn.setSender(sender);
        creditTxn.setReceiver(receiver);
        transactionRepository.save(creditTxn);
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

        Transaction debitTxn = new Transaction();
        debitTxn.setAmount(amount);
        debitTxn.setTimestamp(now);
        debitTxn.setType("DEBIT");
        debitTxn.setDescription("Transfer to " + receiver.getAccountNumber());
        debitTxn.setSender(sender);
        debitTxn.setReceiver(receiver);
        transactionRepository.save(debitTxn);

        Transaction creditTxn = new Transaction();
        creditTxn.setAmount(amount);
        creditTxn.setTimestamp(now);
        creditTxn.setType("CREDIT");
        creditTxn.setDescription("Received from " + sender.getAccountNumber());
        creditTxn.setSender(sender);
        creditTxn.setReceiver(receiver);
        transactionRepository.save(creditTxn);
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

            // Record transaction
            Transaction creditTxn = new Transaction();
            creditTxn.setAmount(request.getAmount());
            creditTxn.setTimestamp(LocalDateTime.now());
            creditTxn.setType("CREDIT");
            creditTxn.setDescription("Money Deposited");
            creditTxn.setSender(card);
            creditTxn.setReceiver(card);
            transactionRepository.save(creditTxn);

            return new MoneyDepositResponse(true, "Successfully Deposited!");

        } catch (ResourceNotFoundException e) {
            throw e; // propagate for controller → 404 Not Found
        } catch (Exception e) {
            // Log and wrap unexpected exceptions
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
                return new MoneyWithdrawResponse(false, "Please provide valid PIN!.");
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
            Transaction debitTxn = new Transaction();
            debitTxn.setAmount(request.getAmount());
            debitTxn.setTimestamp(LocalDateTime.now());
            debitTxn.setType("DEBIT");
            debitTxn.setDescription("Money Withdrawn");
            debitTxn.setSender(card);
            debitTxn.setReceiver(card);
            transactionRepository.save(debitTxn);

            return new MoneyWithdrawResponse(true, "Money withdrawal successful");

        } catch (ResourceNotFoundException e) {
            throw e; // propagate for controller → 404 Not Found
        } catch (Exception e) {
            System.err.println("Failed to withdraw money: " + e.getMessage());
            throw new RuntimeException("Unable to withdraw money. Please try again later.", e);
        }
    }


    public List<Transaction> getDebitTransactions(Long userId) {
        try {
            List<Transaction> transactions = transactionRepository.findBySenderIdAndType(userId, "DEBIT");

            if (transactions.isEmpty()) {
                System.out.println("No debit transactions found for user ID: " + userId);
            }

            return transactions;

        } catch (Exception e) {
            // Log unexpected errors and rethrow
            System.err.println("Failed to fetch debit transactions for user ID " + userId + ": " + e.getMessage());
            throw new RuntimeException("Could not retrieve debit transactions. Please try again later.", e);
        }
    }


    public List<Transaction> getCreditTransactions(Long userId) {
        try {
            List<Transaction> transactions = transactionRepository.findByReceiverIdAndType(userId, "CREDIT");

            if (transactions.isEmpty()) {
                System.out.println("No credit transactions found for user ID: " + userId);
            }

            return transactions;

        } catch (Exception e) {
            // Log unexpected errors and rethrow
            System.err.println("Failed to fetch credit transactions for user ID " + userId + ": " + e.getMessage());
            throw new RuntimeException("Could not retrieve credit transactions. Please try again later.", e);
        }
    }


    public List<Transaction> getAllTransactionsForUser(Long userId) {
        try {
            List<Transaction> transactions = transactionRepository.findBySenderIdOrReceiverId(userId, userId);

            if (transactions.isEmpty()) {
                System.out.println("No transactions found for user ID: " + userId);
            }

            return transactions;

        } catch (Exception e) {
            // Log the error and rethrow as RuntimeException
            System.err.println("Failed to fetch transactions for user ID " + userId + ": " + e.getMessage());
            throw new RuntimeException("Could not retrieve transactions. Please try again later.", e);
        }
    }

}
