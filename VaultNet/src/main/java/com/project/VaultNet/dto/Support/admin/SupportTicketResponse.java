package com.project.VaultNet.dto.Support.admin;

import lombok.Builder;
import lombok.*;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SupportTicketResponse {
    private Long id;
    private String email;
    private String subject;
    private String message;
    private String status;
    private Instant createdAt;
    private String username;
}
