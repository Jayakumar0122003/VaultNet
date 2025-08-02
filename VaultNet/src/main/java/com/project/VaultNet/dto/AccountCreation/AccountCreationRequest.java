package com.project.VaultNet.dto.AccountCreation;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class AccountCreationRequest {

    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate dob;
    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
}
