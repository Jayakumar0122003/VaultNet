package com.project.VaultNet.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
public class UserController {

    @GetMapping("/greet")
    public String userGreet(){
        return "Hi Everyone!, I'm User!";
    }
}
