package com.project.VaultNet.controller;

import com.project.VaultNet.dto.TransactionDto.TransferByAccountNumRequest;
import com.project.VaultNet.dto.TransactionDto.TransferByAccountNumResponse;
import com.project.VaultNet.dto.TransactionDto.TransferViaCardRequest;
import com.project.VaultNet.dto.TransactionDto.TransferViaCardResponse;
import com.project.VaultNet.dto.cardPinDto.ChangePinRequest;
import com.project.VaultNet.dto.cardPinDto.ChangePinResponse;
import com.project.VaultNet.dto.cardPinDto.SetPinResponse;
import com.project.VaultNet.dto.cardPinDto.SetPinRequest;
import com.project.VaultNet.service.TransactionService;
import com.project.VaultNet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    TransactionService transactionService;

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

    @PostMapping("/transfer-account")
    public TransferByAccountNumResponse transferMoney(@RequestBody TransferByAccountNumRequest request) {
        return transactionService.transferMoney(request);
    }

    @PostMapping("/transfer-card")
    public TransferViaCardResponse transferMoney(@RequestBody TransferViaCardRequest request) {
        return transactionService.transferUsingCardDetails(request);
    }
}
