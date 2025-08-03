package com.project.VaultNet.dto.Support;

import com.project.VaultNet.model.SupportTicket;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GetAllTicketsByUserResponse {
    List<SupportTicket> ticket;
}
