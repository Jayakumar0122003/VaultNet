package com.project.VaultNet.service;

import com.project.VaultNet.dto.Support.GetAllTicketsByUserResponse;
import com.project.VaultNet.dto.Support.SupportRequest;
import com.project.VaultNet.dto.Support.SupportResponse;
import com.project.VaultNet.model.SupportTicket;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.repository.SupportTicketRepository;
import com.project.VaultNet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class SupportService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    SupportTicketRepository supportTicketRepository;

    public SupportResponse raiseTicket(SupportRequest request) {
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("Invalid Email Address!"));

        SupportTicket supportTicket = new SupportTicket();
        supportTicket.setSubject(request.getSubject());
        supportTicket.setMessage(request.getMessage());
        supportTicket.setEmail(request.getEmail());
        supportTicket.setUserTicket(user);
        supportTicket.setStatus("OPEN");
        supportTicket.setCreatedAt(Instant.now());
        supportTicketRepository.save(supportTicket);
        return new SupportResponse(true, "Ticket Successfully raise!");
    }

    public GetAllTicketsByUserResponse getAllTicketsByUser(Long id) {
        List<SupportTicket> tickets = supportTicketRepository.findByUserTicket_Id(id);
        return new GetAllTicketsByUserResponse(tickets);
    }
}
