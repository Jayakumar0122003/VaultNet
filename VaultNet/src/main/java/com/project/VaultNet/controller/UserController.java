package com.project.VaultNet.controller;

import com.project.VaultNet.dto.ChangePinRequest;
import com.project.VaultNet.dto.ChangePinResponse;
import com.project.VaultNet.dto.SetPinResponse;
import com.project.VaultNet.dto.SetPinRequest;
import com.project.VaultNet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class UserController {

    @Autowired
    UserService userService;

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
}
