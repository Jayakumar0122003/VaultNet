package com.project.VaultNet.dto.Support;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupportResponse {
    private boolean success;
    private String message;
}
