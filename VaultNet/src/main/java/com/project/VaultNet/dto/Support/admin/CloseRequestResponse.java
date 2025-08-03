package com.project.VaultNet.dto.Support.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CloseRequestResponse {
    private boolean success;
    private String message;
}
