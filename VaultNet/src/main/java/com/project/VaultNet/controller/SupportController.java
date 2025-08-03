package com.project.VaultNet.controller;

import com.project.VaultNet.dto.Support.GetAllTicketsByUserResponse;
import com.project.VaultNet.dto.Support.SupportRequest;
import com.project.VaultNet.dto.Support.SupportResponse;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/customer")
public class SupportController {

    @Autowired
    SupportService supportService;

    @PostMapping("/raise-ticket")
    public SupportResponse raiseTicket(@RequestBody SupportRequest request){
        return supportService.raiseTicket(request);
    }

    @GetMapping("/get-all-users/{id}")
    public GetAllTicketsByUserResponse getAllTicketsByUser(@PathVariable Long id, Principal principal) {
        return supportService.getAllTicketsByUser(id,principal);
    }

}
