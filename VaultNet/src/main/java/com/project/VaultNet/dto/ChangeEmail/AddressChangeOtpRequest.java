package com.project.VaultNet.dto.ChangeEmail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressChangeOtpRequest {
    private String email;
}
