package com.project.VaultNet.controller;

import com.project.VaultNet.customexceptions.InvalidCredentialsException;
import com.project.VaultNet.customexceptions.ResourceNotFoundException;
import com.project.VaultNet.dto.Support.GetAllTicketsByUserResponse;
import com.project.VaultNet.dto.Support.SupportRequest;
import com.project.VaultNet.dto.Support.SupportResponse;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class SupportController {

    @Autowired
    SupportService supportService;

    @PostMapping("/raise-ticket")
    public ResponseEntity<?> raiseTicket(@RequestBody SupportRequest request, Principal principal) {
        try {
            SupportResponse response = supportService.raiseTicket(request, principal);
            return ResponseEntity.ok(response);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new SupportResponse(false, e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new SupportResponse(false, e.getMessage()));
        }
    }




    @GetMapping("/get-all-users/{id}")
    public ResponseEntity<GetAllTicketsByUserResponse> getAllTicketsByUser(
            @PathVariable Long id, Principal principal) {
        GetAllTicketsByUserResponse response = supportService.getAllTicketsByUser(id, principal);

        // If access denied or error, return 403 or 500
        if (response.getTicket().isEmpty() && response.getMessage().startsWith("Access Denied")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } else if (response.getTicket().isEmpty() && response.getMessage().startsWith("Error")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        return ResponseEntity.ok(response);
    }


}
