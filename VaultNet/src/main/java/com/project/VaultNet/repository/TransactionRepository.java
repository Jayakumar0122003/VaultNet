package com.project.VaultNet.repository;

import com.project.VaultNet.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllBySender_User_IdOrReceiver_User_Id(Long senderUserId, Long receiverUserId);

    List<Transaction> findBySenderIdAndType(Long userId, String debit);

    List<Transaction> findByReceiverIdAndType(Long userId, String credit);

    List<Transaction> findBySenderIdOrReceiverId(Long userId, Long userId1);
}

