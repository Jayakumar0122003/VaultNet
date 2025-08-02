package com.project.VaultNet.repository;

import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DebitCardRepository extends JpaRepository<DebitCard, Long> {

    Optional<DebitCard> findByPhoneEndingWith(String lastFourDigits);
    Optional<DebitCard> findByEmail(String email);
    Optional<DebitCard> findByAccountNumber(String accountNumber);
    Optional<DebitCard> findByCardNumber(String accountNumber);
    List<DebitCard> findAllByCardBlockedTrue();
    Optional<DebitCard> findByOtp(String otp);
    Optional<DebitCard> findByPinHash(String encode);
}