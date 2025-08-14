package com.project.VaultNet.dto.ChangeEmail;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChangeAccountPassword {
    private String oldPassword;
    private String newPassword;
}
