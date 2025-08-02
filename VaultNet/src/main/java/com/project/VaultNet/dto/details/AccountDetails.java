package com.project.VaultNet.dto.details;


import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDetails {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate dob;
    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
    private String accountNumber;
}
