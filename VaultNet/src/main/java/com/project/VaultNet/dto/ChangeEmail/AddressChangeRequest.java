package com.project.VaultNet.dto.ChangeEmail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressChangeRequest {
    private String otp;
    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
}
