package com.project.VaultNet.controller;

import com.project.VaultNet.dto.AccountCreation.AccountCreationRequest;
import com.project.VaultNet.dto.AccountCreation.AccountCreationResponse;
import com.project.VaultNet.dto.TransactionDto.*;
import com.project.VaultNet.dto.cardPinDto.*;
import com.project.VaultNet.dto.details.AccountDetails;
import com.project.VaultNet.dto.details.DebitCardDetails;
import com.project.VaultNet.dto.details.DebitCardDetailsRequest;
import com.project.VaultNet.model.Role;
import com.project.VaultNet.model.Transaction;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.service.DebitCardService;
import com.project.VaultNet.service.TransactionService;
import com.project.VaultNet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    TransactionService transactionService;

    @Autowired
    DebitCardService debitCardService;

    @GetMapping("/greet")
    public String userGreet(){
        return "Hi Everyone!, I'm User!";
    }

    @PostMapping("/set-pin")
    public SetPinResponse setPin(@RequestBody SetPinRequest request) {
        return userService.setPin(request);
    }

    @PostMapping("/change-pin")
    public ChangePinResponse changePin(@RequestBody ChangePinRequest changePinRequest){
        return userService.changePin(changePinRequest);
    }

    @PostMapping("/forgot-pin")
    public ForgotPinResponse sendForgotPinOtp(@RequestBody ForgotPinRequest request){
        return userService.sendOtp(request);
    }

    @PostMapping("/verify-pin-otp")
    public VerifyPinOtpResponse verifyOtpPin(@RequestBody VerifyPinOtpRequest request){
        return userService.verifyOtpPin(request);
    }

    @PostMapping("/transfer-account")
    public TransferByAccountNumResponse transferMoney(@RequestBody TransferByAccountNumRequest request) {
        return transactionService.transferMoney(request);
    }

    @PostMapping("/transfer-card")
    public TransferViaCardResponse transferMoney(@RequestBody TransferViaCardRequest request) {
        return transactionService.transferUsingCardDetails(request);
    }

    @GetMapping("/users/{userId}/transactions")
    public ResponseEntity<?> getUserTransactions(@PathVariable Long userId) {
        try {
            List<Transaction> transactions = transactionService.getUserTransactions(userId);
            return ResponseEntity.ok(transactions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid UUID: " + userId);
        }
    }


    @PostMapping("/deposit-money")
    public MoneyDepositResponse depositMoney(@RequestBody MoneyDepositRequest request){
        return transactionService.depositMoney(request);
    }

    @PostMapping("/withdraw-money")
    public MoneyWithdrawResponse withdrawMoney(@RequestBody MoneyWithdrawRequest request){
        return transactionService.withdrawMoney(request);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestParam("token") String token) {
        try {
            Users user = userService.getVerify(token);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Invalid or expired token.");
            }

            if (user.getRole() == Role.CUSTOMER) {
                debitCardService.sendVirtualCardEmail(
                        user.getEmail(),
                        user.getFirstName()+ " "+ user.getLastName(),
                        user.getPhone()
                );
            }

            return ResponseEntity.ok("Email verified successfully. You can now log in.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during verification: " + e.getMessage());
        }
    }

    @PostMapping("/account-creation")
    public AccountCreationResponse createAccount(@RequestBody AccountCreationRequest request) {
        return userService.createAccount(request);
    }

    @GetMapping("/get-account-details/{userId}")
    public AccountDetails getAccountDetails(
            @PathVariable("userId") Long userId) {
        return userService.getAccountDetails(userId);
    }

    @PostMapping("/get-card-details")
    public DebitCardDetails getCardDetails(@RequestBody DebitCardDetailsRequest request){
        return userService.getCardDetails(request);
    }

}
