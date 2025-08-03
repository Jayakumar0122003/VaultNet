package com.project.VaultNet.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class Users {
    //REGISTRATION FIELDS

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Role role;
//    ----------------------------------------------------------------------------

    // ACCOUNT CREATION FIELDS, AND EMAIL USED ABOVE REGISTRATION FIELD

    private String firstName;

    private String lastName;

    private String phone;

    @Embedded
    private Address address;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "email_verified")
    private boolean emailVerified = false;

    @Column(name = "account_created")
    private boolean accountCreated = false;

    @Column(name = "verification_token")
    private String verificationToken;

    private Date createdAt;

    @Column(name = "reset_otp")
    private String resetOtp;

    @Column(name = "reset_otp_expires_at")
    private LocalDateTime resetOtpExpiresAt;


    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private DebitCard debitCard;

    @OneToMany(mappedBy = "userTicket", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<SupportTicket> supportTickets = new ArrayList<>();

}
