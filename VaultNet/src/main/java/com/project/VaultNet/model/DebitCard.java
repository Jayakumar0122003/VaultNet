package com.project.VaultNet.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "debit_card")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DebitCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String cardHolderName;

    @Column(nullable = false, unique = true)
    private String cardNumber;

    @Column(nullable = false)
    private String expiryDate; // optionally convert to YearMonth for validation

    @Column(nullable = false)
    private String cvv;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @CreationTimestamp
    private LocalDateTime issuedAt;

    @Column(name = "pin_hash", length = 60)
    private String pinHash;

    @Column(precision = 19, scale = 4)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "is_pin_set")
    private boolean pinSet = false;

    // OTP storage (hashed) and expiration
    @Column(name = "otp", length = 60)
    private String otp;

    private LocalDateTime otpExpiresAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference
    private Users user;

    @Column(name = "failed_attempts")
    private int failedAttempts = 0;

    @Column(name = "card_blocked")
    private boolean cardBlocked = false;

    @Column(name = "blocked_at")
    private LocalDateTime blockedAt;


    private BigDecimal dailyTransactionLimit = new BigDecimal("50000"); // default 50,000 INR
    private BigDecimal todayTransactionTotal = BigDecimal.ZERO;
    private LocalDate lastTransactionDate;

    @OneToMany(mappedBy = "sender")
    @JsonManagedReference(value = "sent")
    private List<Transaction> sentTransactions;

    @OneToMany(mappedBy = "receiver")
    @JsonManagedReference(value = "received")
    private List<Transaction> receivedTransactions;
    ;



}
