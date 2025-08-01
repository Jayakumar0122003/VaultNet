package com.project.VaultNet.repository;

import com.project.VaultNet.model.DebitCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DebitCardRepository extends JpaRepository<DebitCard, Long> {

    Optional<DebitCard> findByPhoneEndingWith(String lastFourDigits);
    Optional<DebitCard> findByEmail(String email);
    Optional<DebitCard> findByAccountNumber(String accountNumber);
    Optional<DebitCard> findByCardNumber(String accountNumber);
}