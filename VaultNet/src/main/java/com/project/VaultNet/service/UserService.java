package com.project.VaultNet.service;

import com.project.VaultNet.dto.RegisterRequest;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import com.project.VaultNet.service.EmailServiceImp;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailServiceImp emailServiceImp;

    public Optional<Users> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    public Users registerUser(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Username already exists");
        }
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Email already exists");
        }

        String token = UUID.randomUUID().toString();

        Users user = Users.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .verificationToken(token)
                .build();
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;

        emailServiceImp.sendVerificationEmail(user.getEmail(), verificationLink, user.getFullName());

        return userRepository.save(user);
    }

    public Users getVerify(String token) {
        Optional<Users> optionalUser = userRepository.findByVerificationToken(token);
        if (optionalUser.isEmpty()) {
             throw new RuntimeException("Invalid Token!");
        }
        Users user = optionalUser.get();
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        return userRepository.save(user);
    }
}
