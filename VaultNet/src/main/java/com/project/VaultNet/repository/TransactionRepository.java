package com.project.VaultNet.repository;

import com.project.VaultNet.model.Transaction;
import com.project.VaultNet.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // All debits for user
    @Query("SELECT t FROM Transaction t WHERE t.sender.id = :cardId AND t.type = :type ORDER BY t.timestamp DESC")
    List<Transaction> findUserDebits(@Param("cardId") Long cardId, @Param("type") TransactionType type);

    // All credits for user (including deposits)
    @Query("SELECT t FROM Transaction t WHERE t.receiver.id = :cardId AND (t.type = :credit OR t.type = :deposit) ORDER BY t.timestamp DESC")
    List<Transaction> findUserCredits(@Param("cardId") Long cardId,
                                      @Param("credit") TransactionType credit,
                                      @Param("deposit") TransactionType deposit);

    // Full history (all transactions involving user)
    @Query("SELECT t FROM Transaction t WHERE t.sender.id = :cardId OR t.receiver.id = :cardId ORDER BY t.timestamp DESC")
    List<Transaction> findFullHistory(@Param("cardId") Long cardId);
}