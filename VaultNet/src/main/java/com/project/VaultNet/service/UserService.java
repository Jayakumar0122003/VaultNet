package com.project.VaultNet.service;

import com.project.VaultNet.dto.AuthDto.RegisterRequest;
import com.project.VaultNet.dto.cardPinDto.ChangePinRequest;
import com.project.VaultNet.dto.cardPinDto.ChangePinResponse;
import com.project.VaultNet.dto.cardPinDto.SetPinRequest;
import com.project.VaultNet.dto.cardPinDto.SetPinResponse;
import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.model.Transaction;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.repository.DebitCardRepository;
import com.project.VaultNet.repository.TransactionRepository;
import com.project.VaultNet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailServiceImp emailServiceImp;

    @Autowired
    DebitCardRepository debitCardRepository;

    private final Random random = new Random();

    public Optional<Users> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    public Users registerUser(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already exists");
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



    public SetPinResponse setPin(SetPinRequest request) {
        Optional<DebitCard> optionalCard = debitCardRepository.findByPhoneEndingWith(request.getLastFourDigits());

        if (optionalCard.isEmpty()) {
            return new SetPinResponse(false, "No card found with matching phone number.");
        }

        DebitCard card = optionalCard.get();

        if (card.isPinSet()) {
            return new SetPinResponse(false, "PIN is already set.");
        }

        String hashedPin = passwordEncoder.encode(request.getPin());
        card.setPinHash(hashedPin);
        card.setPinSet(true);
        debitCardRepository.save(card);

        return new SetPinResponse(true, "PIN set successfully.");
    }

    public ChangePinResponse changePin(ChangePinRequest changePinRequest) {
        DebitCard card = debitCardRepository.findByEmail(changePinRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not found"));


        if (!passwordEncoder.matches(changePinRequest.getOldPin(), card.getPinHash())) {
            throw new RuntimeException("Old PIN does not match");
        }

        String newHashedPin = passwordEncoder.encode(changePinRequest.getNewPin());
        card.setPinHash(newHashedPin);

        debitCardRepository.save(card);
        return new ChangePinResponse(true, "Pin Change Successfully!");
    }
}

