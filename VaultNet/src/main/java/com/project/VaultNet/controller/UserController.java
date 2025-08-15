package com.project.VaultNet.controller;

import com.project.VaultNet.customexceptions.ResourceNotFoundException;
import com.project.VaultNet.dto.AccountCreation.AccountCreationRequest;
import com.project.VaultNet.dto.AccountCreation.AccountCreationResponse;
import com.project.VaultNet.dto.AccountCreation.UserProfileDTO;
import com.project.VaultNet.dto.ChangeEmail.*;
import com.project.VaultNet.dto.TransactionDto.*;
import com.project.VaultNet.dto.cardPinDto.*;
import com.project.VaultNet.dto.details.AccountDetails;
import com.project.VaultNet.dto.details.AccountDetailsResponse;
import com.project.VaultNet.dto.details.DebitCardDetails;
import com.project.VaultNet.dto.details.DebitCardDetailsRequest;
import com.project.VaultNet.model.Role;
import com.project.VaultNet.model.Transaction;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.repository.UserRepository;
import com.project.VaultNet.service.DebitCardService;
import com.project.VaultNet.service.TransactionService;
import com.project.VaultNet.service.UserService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    TransactionService transactionService;

    @Autowired
    DebitCardService debitCardService;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/greet")
    public String userGreet(){
        return "Hi Everyone!, I'm User!";
    }

    @PostMapping("/set-pin")
    public ResponseEntity<SetPinResponse> setPin(@RequestBody SetPinRequest request, Principal principal) {
        try {
            SetPinResponse response = userService.setPin(request, principal );

            if (!response.isSuccess()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new SetPinResponse(false, e.getMessage()));
        }
    }


    @PostMapping("/change-pin")
    public ResponseEntity<ChangePinResponse> changePin(@RequestBody ChangePinRequest request, Principal principal) {
        ChangePinResponse response = userService.changePin(request, principal);
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }



    @PostMapping("/forgot-pin")
    public ResponseEntity<ForgotPinResponse> sendForgotPinOtp(
            @RequestBody ForgotPinRequest request,
            Principal principal) {

        ForgotPinResponse response = userService.sendOtp(request, principal);

        // Return 400 if OTP cannot be sent
        if (!response.isStatus()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }

        // Success
        return ResponseEntity.ok(response);
    }





    @PostMapping("/verify-pin-otp")
    public ResponseEntity<VerifyPinOtpResponse> verifyOtpPin(@RequestBody VerifyPinOtpRequest request, Principal principal) {
        VerifyPinOtpResponse response = userService.verifyOtpPin(request, principal);

        if (!response.isStatus()) {
            // Invalid or expired OTP → return 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Success → 200 OK
        return ResponseEntity.ok(response);
    }


    @PostMapping("/reset-pin")
    public ResponseEntity<ResetPinResponse> resetPin(@RequestBody ResetPinRequest request, Principal principal) {
        ResetPinResponse response = userService.resetPin(request, principal);

        if (!response.isSuccess()) {
            // New PIN same as old PIN → 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        return ResponseEntity.ok(response);
    }


    @PostMapping("/transfer-account")
    public ResponseEntity<TransferByAccountNumResponse> transferMoney(@RequestBody TransferByAccountNumRequest request) {
        TransferByAccountNumResponse response = transactionService.transferMoney(request);

        if (!response.isSuccess()) {
            // Business failure (e.g., invalid PIN, insufficient balance, blocked card) → 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Success → 200 OK
        return ResponseEntity.ok(response);
    }


    @PostMapping("/transfer-card")
    public ResponseEntity<TransferViaCardResponse> transferMoney(@RequestBody TransferViaCardRequest request) {
        TransferViaCardResponse response = transactionService.transferUsingCardDetails(request);

        if (!response.isSuccess()) {
            // Business failure (e.g., invalid PIN, incorrect card details, blocked card, insufficient balance) → 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Success → 200 OK
        return ResponseEntity.ok(response);
    }


    @GetMapping("/user/{userId}/transactions")
    public ResponseEntity<?> getUserTransactions(@PathVariable Long userId, Principal principal) {
        try {
            // Fetch current logged-in user
            Users currentUser = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Check access
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied"));
            }

            List<Transaction> transactions = transactionService.getAllTransactionsForUser(userId);

            if (transactions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "No transactions found"));
            }

            return ResponseEntity.ok(Map.of("success", true, "transactions", transactions));

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Failed to fetch transactions: " + e.getMessage()));
        }
    }


    @GetMapping("/user/{userId}/debit")
    public ResponseEntity<?> getDebitTransactions(@PathVariable Long userId, Principal principal) {
        try {
            Users currentUser = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied"));
            }

            List<Transaction> transactions = transactionService.getDebitTransactions(userId);

            if (transactions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "No debit transactions found"));
            }

            return ResponseEntity.ok(Map.of("success", true, "transactions", transactions));

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Failed to fetch debit transactions: " + e.getMessage()));
        }
    }


    @GetMapping("/user/{userId}/credit")
    public ResponseEntity<?> getCreditTransactions(@PathVariable Long userId, Principal principal) {
        try {
            Users currentUser = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Access denied"));
            }

            List<Transaction> transactions = transactionService.getCreditTransactions(userId);

            if (transactions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "No credit transactions found"));
            }

            return ResponseEntity.ok(Map.of("success", true, "transactions", transactions));

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Failed to fetch credit transactions: " + e.getMessage()));
        }
    }



    @PostMapping("/deposit-money")
    public ResponseEntity<?> depositMoney(@RequestBody MoneyDepositRequest request) {
        try {
            MoneyDepositResponse response = transactionService.depositMoney(request);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(Map.of(
                            "success", response.isSuccess(),
                            "message", response.getMessage()
                    ));

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to deposit money: " + e.getMessage()
                    ));
        }
    }

    @PostMapping("/withdraw-money")
    public ResponseEntity<?> withdrawMoney(@RequestBody MoneyWithdrawRequest request) {
        try {
            MoneyWithdrawResponse response = transactionService.withdrawMoney(request);
            HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;

            return ResponseEntity.status(status)
                    .body(Map.of(
                            "success", response.isSuccess(),
                            "message", response.getMessage()
                    ));

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to withdraw money: " + e.getMessage()
                    ));
        }
    }


    @PostMapping("/account-creation")
    public ResponseEntity<?> createAccount(@RequestBody AccountCreationRequest request) {
        try {
            AccountCreationResponse response = userService.createAccount(request);

            HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;

            return ResponseEntity.status(status)
                    .body(Map.of(
                            "success", response.isSuccess(),
                            "message", response.getMessage()
                    ));

        } catch (Exception e) {
            System.err.println("Error creating account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred while creating account."
                    ));
        }
    }


    @GetMapping("/get-account-details/{userId}")
    public AccountDetails getAccountDetails(
            @PathVariable("userId") Long userId) {
        return userService.getAccountDetails(userId);
    }

    @GetMapping("/account")
    public ResponseEntity<?> getAccountDetails(Principal principal) {
        try {
            AccountDetailsResponse response = userService.account(principal);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", response
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            System.err.println("Failed to get account details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An error occurred while fetching account details."
                    ));
        }
    }


    @GetMapping("/get-account")
    public ResponseEntity<?> getAccount(Principal principal) {
        try {
            UserProfileDTO profile = userService.getAccount(principal);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", profile
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            System.err.println("Failed to fetch account for " + principal.getName() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred while fetching account."
                    ));
        }
    }


    @PostMapping("/get-card-details")
    public ResponseEntity<?> getCardDetails(@RequestBody DebitCardDetailsRequest request) {
        try {
            DebitCardDetails cardDetails = userService.getCardDetails(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", cardDetails
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            System.err.println("Failed to fetch card details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An error occurred while fetching card details."
                    ));
        }
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
    public ResponseEntity<?> changePhone(@RequestBody ChangePhoneRequest request,Principal principal) {
        try {
            GenericResponse response = userService.initiatePhoneChange(request,principal);
            return ResponseEntity.ok(Map.of("success", true, "data", response));
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



    @PutMapping("/change-address")
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


    @PostMapping("/verify-otp-address")
    public ResponseEntity<?> verifyOtpAddress(@RequestBody AddressChangeRequest request, Principal principal) {
        try {
            GenericResponse response = userService.verifyOtpAndUpdateAddress(request, principal);

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



    @GetMapping("/get-atm-card")
    public ResponseEntity<?> getAtmCard(Principal principal) {
        try {
            return debitCardService.sendAtmCard(principal);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error fetching ATM card for user " + principal.getName() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while sending the virtual ATM card.");
        }
    }


}
