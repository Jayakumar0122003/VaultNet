package com.project.VaultNet.dto.Admin;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDetailsChange {
    private String otp;
    private String firstName;
    private String lastName;
    private String phone;
    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
}
