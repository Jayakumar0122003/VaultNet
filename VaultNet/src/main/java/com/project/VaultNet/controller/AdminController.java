package com.project.VaultNet.controller;

import com.project.VaultNet.dto.Support.admin.CloseRequestResponse;
import com.project.VaultNet.dto.Support.admin.SupportTicketResponse;
import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.repository.DebitCardRepository;
import com.project.VaultNet.service.DebitCardService;
import com.project.VaultNet.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/greet")
    public String adminGreet(){
        return "Hi Everyone!, I'm Admin!";
    }

    @Autowired
    private DebitCardService debitCardService;

    @Autowired
    private DebitCardRepository debitCardRepository;

    @Autowired
    private SupportService supportService;

    @GetMapping("/blocked-cards")
    public ResponseEntity<List<DebitCard>> getBlockedCards() {
        List<DebitCard> blocked = debitCardRepository.findAllByCardBlockedTrue();
        return ResponseEntity.ok(blocked);
    }

    @PostMapping("/unblock-card")
    public ResponseEntity<String> unblockCard(@RequestParam String cardNumber) {
        try {
            DebitCard card = debitCardService.unblockCard(cardNumber);
            return ResponseEntity.ok("Card ending with " +
                    card.getCardNumber().substring(card.getCardNumber().length() - 4) +
                    " has been successfully unblocked.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users-tickets")
    public List<SupportTicketResponse> getAllTicketsForAdmin() {
        return supportService.getAllTicketsForAdmin();
    }

    @PutMapping("/close-ticket/{ticketId}")
    public CloseRequestResponse closeTicket(@PathVariable Long ticketId){
        return supportService.closeSupportTicket(ticketId);
    }
}
