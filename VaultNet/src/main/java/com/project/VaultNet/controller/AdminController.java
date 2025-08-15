package com.project.VaultNet.controller;

import com.project.VaultNet.customexceptions.ResourceNotFoundException;
import com.project.VaultNet.dto.Admin.AdminDetailResponse;
import com.project.VaultNet.dto.Admin.AdminDetailsChange;
import com.project.VaultNet.dto.ChangeEmail.*;
import com.project.VaultNet.dto.Support.admin.CloseRequestResponse;
import com.project.VaultNet.dto.Support.admin.SupportTicketResponse;
import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.repository.DebitCardRepository;
import com.project.VaultNet.service.DebitCardService;
import com.project.VaultNet.service.SupportService;
import com.project.VaultNet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private UserService userService;

    @GetMapping("/get-user")
    public ResponseEntity<?> getUser(Principal principal){
        AdminDetailResponse response = userService.getAdminDetails(principal);
        return ResponseEntity.ok(response);
    }

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
    public ResponseEntity<?> getAllTicketsForAdmin() {
        try {
            List<SupportTicketResponse> tickets = supportService.getAllTicketsForAdmin();
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch tickets: " + e.getMessage());
        }
    }


    @PutMapping("/close-ticket/{ticketId}")
    public ResponseEntity<CloseRequestResponse> closeTicket(@PathVariable Long ticketId) {
        CloseRequestResponse response = supportService.closeSupportTicket(ticketId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-email")
    public ResponseEntity<?> changeEmail(@RequestBody ChangeEmailRequest request, Principal principal) {
        ChangeEmailResponse response = userService.changeEmail(request, principal);

        if (!response.isMsgStatus()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", response.getMessage()));
        }

        return ResponseEntity.ok(Map.of("success", true, "message", response.getMessage()));
    }


    @PutMapping("/change-phone")
    public ResponseEntity<?> changePhone(@RequestBody ChangePhoneRequest request, Principal principal) {
        try {
            GenericResponse response = userService.initiatePhoneChange(request, principal);

            return ResponseEntity
                    .status(response.isStatus() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", response.isStatus(),
                            "message", response.getMessage()
                    ));

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Failed to initiate phone change for " + request.getEmail() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "An unexpected error occurred while sending OTP."));
        }
    }




    @PostMapping("/verify-otp-phone")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request, Principal principal) {
        GenericResponse response = userService.verifyOtpAndUpdatePhone(request, principal);

        if (!response.isStatus()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", response.getMessage()));
        }

        return ResponseEntity.ok(Map.of("success", true, "message", response.getMessage()));
    }



    @PutMapping("/change-details")
    public ResponseEntity<?> changeAddress(@RequestBody AddressChangeOtpRequest request, Principal principal) {
        try {
            GenericResponse response = userService.changeAddressRequest(request, principal);
            return ResponseEntity.ok(Map.of("success", response.isStatus(), "message", response.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Failed to send OTP for address change to " + request.getEmail() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "An unexpected error occurred while sending OTP."));
        }
    }


    @PostMapping("/verify-otp-details")
    public ResponseEntity<?> verifyOtpAddress(@RequestBody AdminDetailsChange request, Principal principal) {
        try {
            GenericResponse response = userService.verifyOtpAndChangeDetails(request, principal);

            if (!response.isStatus()) {
                // OTP is wrong or expired
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", response.getMessage()));
            }

            return ResponseEntity.ok(Map.of("success", true, "message", response.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error verifying OTP and updating address for user " + principal.getName() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "An unexpected error occurred while updating address."));
        }
    }



    @PostMapping("/change-account-password")
    public ResponseEntity<?> changeAccountPassword(@RequestBody ChangeAccountPassword request, Principal principal) {
        try {
            ChangeAccountPasswordResponse response = userService.changeAccountPassword(request, principal);

            if (!response.isSuccess()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", response.getMessage()));
            }

            return ResponseEntity.ok(Map.of("success", true, "message", response.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error changing account password for user " + principal.getName() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "An unexpected error occurred while changing password."));
        }
    }

}
