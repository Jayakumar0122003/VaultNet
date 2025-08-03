package com.project.VaultNet.dto.ChangeEmail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeEmailResponse {
    private String message;
    private boolean isMsgStatus;
}
