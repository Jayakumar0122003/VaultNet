package com.project.VaultNet.dto.Support;

// SupportRequest.java

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupportRequest {
    private String email;
    private String subject;
    private String message;
}

