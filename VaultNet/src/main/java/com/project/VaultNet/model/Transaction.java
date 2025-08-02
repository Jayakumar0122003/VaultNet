package com.project.VaultNet.model;

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

    private String type; // "DEBIT" or "CREDIT"

    private String description;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private DebitCard sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private DebitCard receiver;
}
