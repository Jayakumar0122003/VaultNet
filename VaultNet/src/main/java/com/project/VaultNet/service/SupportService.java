package com.project.VaultNet.service;

import com.project.VaultNet.customexceptions.InvalidCredentialsException;
import com.project.VaultNet.customexceptions.ResourceNotFoundException;
import com.project.VaultNet.dto.Support.GetAllTicketsByUserResponse;
import com.project.VaultNet.dto.Support.SupportRequest;
import com.project.VaultNet.dto.Support.SupportResponse;
import com.project.VaultNet.dto.Support.admin.CloseRequestResponse;
import com.project.VaultNet.dto.Support.admin.SupportTicketResponse;
import com.project.VaultNet.model.SupportTicket;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.repository.SupportTicketRepository;
import com.project.VaultNet.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Service
public class SupportService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    SupportTicketRepository supportTicketRepository;

    public SupportResponse raiseTicket(SupportRequest request, Principal principal) {
        Users user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Email Address!"));

        if (!user.getEmail().equals(request.getEmail())) {
            throw new InvalidCredentialsException("Email address does not match logged-in user.");
        }

        SupportTicket supportTicket = new SupportTicket();
        supportTicket.setSubject(request.getSubject());
        supportTicket.setMessage(request.getMessage());
        supportTicket.setEmail(request.getEmail());
        supportTicket.setUsername(user.getFirstName());
        supportTicket.setUserTicket(user);
        supportTicket.setStatus("OPEN");
        supportTicket.setCreatedAt(Instant.now());

        supportTicketRepository.save(supportTicket);

        return new SupportResponse(true, "Ticket successfully raised!");
    }


    public GetAllTicketsByUserResponse getAllTicketsByUser(Long userId, Principal principal) {
        try {
            Users user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid Access!"));

            if (!user.getId().equals(userId)) {
                return new GetAllTicketsByUserResponse(
                        "Access Denied: You cannot view other users' tickets.",
                        Collections.emptyList()
                );
            }

            List<SupportTicket> tickets = supportTicketRepository.findByUserTicket_Id(userId);
            return new GetAllTicketsByUserResponse("Success", tickets);

        } catch (ResourceNotFoundException e) {
            return new GetAllTicketsByUserResponse("Error: " + e.getMessage(), Collections.emptyList());
        } catch (Exception e) {
            return new GetAllTicketsByUserResponse(
                    "Unexpected error occurred: " + e.getMessage(),
                    Collections.emptyList()
            );
        }
    }


    public List<SupportTicketResponse> getAllTicketsForAdmin() {
        try {
            List<SupportTicket> tickets = supportTicketRepository.findAll();

            return tickets.stream()
                    .map(ticket -> SupportTicketResponse.builder()
                            .id(ticket.getId())
                            .email(ticket.getEmail())
                            .subject(ticket.getSubject())
                            .message(ticket.getMessage())
                            .status(ticket.getStatus())
                            .createdAt(ticket.getCreatedAt())
                            .username(ticket.getUserTicket() != null ? ticket.getUserTicket().getUsername() : "Unknown")
                            .build())
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch tickets for admin: " + e.getMessage());
        }
    }


    public CloseRequestResponse closeSupportTicket(Long ticketId) {
        try {
            SupportTicket ticket = supportTicketRepository.findById(ticketId)
                    .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));

            if ("CLOSED".equalsIgnoreCase(ticket.getStatus())) {
                return new CloseRequestResponse(false, "Ticket is already closed.");
            }

            ticket.setStatus("CLOSED");
            supportTicketRepository.save(ticket);

            return new CloseRequestResponse(true, "Ticket closed successfully.");
        } catch (ResourceNotFoundException e) {
            // Log if needed
            return new CloseRequestResponse(false, e.getMessage());
        } catch (Exception e) {
            return new CloseRequestResponse(false, "An error occurred while closing the ticket.");
        }
    }

}
