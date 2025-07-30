package com.project.VaultNet.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    private String fullName;

    private String phone;

    private String password;

    private String signinCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Role role;


    private boolean emailVerified;

    private String cardNumber;

    private String cardCVV;

    private String cardExpiry;

    private double balance;

    private Date createdAt;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    private List<Transaction> sentTransactions;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL)
    private List<Transaction> receivedTransactions;
}
