package com.project.VaultNet.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;

    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // CREDIT, DEBIT, DEPOSIT

    private String description;

    // The user who initiated the transaction
    @ManyToOne
    @JoinColumn(name = "sender_id")
    @JsonBackReference
    private DebitCard sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    @JsonBackReference
    private DebitCard receiver;
}
