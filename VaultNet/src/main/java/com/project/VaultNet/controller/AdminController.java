package com.project.VaultNet.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/greet")
    public String adminGreet(){
        return "Hi Everyone!, I'm Admin!";
    }
}
