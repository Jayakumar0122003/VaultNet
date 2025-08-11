package com.project.VaultNet.service;

import com.project.VaultNet.dto.AccountCreation.AccountCreationRequest;
import com.project.VaultNet.dto.AccountCreation.AccountCreationResponse;
import com.project.VaultNet.dto.AccountCreation.UserProfileDTO;
import com.project.VaultNet.dto.AuthDto.*;
import com.project.VaultNet.dto.ChangeEmail.*;
import com.project.VaultNet.dto.TransactionDto.MoneyDepositRequest;
import com.project.VaultNet.dto.TransactionDto.MoneyDepositResponse;
import com.project.VaultNet.dto.cardPinDto.*;
import com.project.VaultNet.dto.details.AccountDetails;
import com.project.VaultNet.dto.details.AccountDetailsResponse;
import com.project.VaultNet.dto.details.DebitCardDetails;
import com.project.VaultNet.dto.details.DebitCardDetailsRequest;
import com.project.VaultNet.model.Address;
import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.model.SupportTicket;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.repository.DebitCardRepository;
import com.project.VaultNet.repository.SupportTicketRepository;
import com.project.VaultNet.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
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

    @Autowired
    SupportTicketRepository supportTicketRepository;

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
                .build();
//        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;

//        emailServiceImp.sendVerificationEmail(user.getEmail(), verificationLink, user.getFullName());

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

    @Transactional
    public ForgotPinResponse sendOtp(ForgotPinRequest request) {
        // Always return generic success
        ForgotPinResponse generic = new ForgotPinResponse(true,
                "If that email exists, an OTP has been sent.");

        Optional<DebitCard> opt = debitCardRepository.findByEmail(request.getEmail());
        if (opt.isEmpty()) {
            return generic;
        }

        DebitCard card = opt.get();

        // generate 6-digit OTP
        int otp = 100_000 + random.nextInt(900_000);
        String otpStr = String.valueOf(otp);

        // hash & store TTL = now + 5min
        card.setOtp(otpStr);
        card.setOtpExpiresAt(LocalDateTime.now().plusMinutes(5));
        debitCardRepository.save(card);

        emailServiceImp.sendOtpForgotPin(card.getEmail(),otpStr,card.getCardHolderName());

        return generic;
    }

    public VerifyPinOtpResponse verifyOtpPin(VerifyPinOtpRequest request) {
        Optional<DebitCard> debitCardOptional = debitCardRepository.findByOtp(request.getOtp());

        if (debitCardOptional.isEmpty()) {
            return new VerifyPinOtpResponse(false,"Invalid OTP");
        }

        DebitCard debitCard = debitCardOptional.get();

        // Step 2: Check if OTP is expired
        if (debitCard.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            return new VerifyPinOtpResponse(false,"OTP expired");
        }

        // Step 3: Encode new PIN and update
        String hashedPin = passwordEncoder.encode(request.getNewPin());
        debitCard.setPinHash(hashedPin);

        // Step 4: Clear OTP and save
        debitCard.setOtp(null);
        debitCard.setOtpExpiresAt(null);
        debitCardRepository.save(debitCard);

        return new VerifyPinOtpResponse(true,"PIN set successfully");

    }

    @Transactional
    public AccountCreationResponse createAccount(AccountCreationRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    if (user.isAccountCreated()) {
                        return new AccountCreationResponse(false, "Account already exists for email: " + request.getEmail());
                    }
                    String token = UUID.randomUUID().toString();
                    // Populate user details
                    user.setFirstName(request.getFirstName());
                    user.setLastName(request.getLastName());
                    user.setPhone(request.getPhone());
                    user.setDob(request.getDob());
                    Address address = new Address();
                    address.setAddressLine(request.getAddressLine());
                    address.setCity(request.getCity());
                    address.setState(request.getState());
                    address.setPostalCode(request.getPostalCode());
                    user.setAddress(address);
                    user.setAccountCreated(true);
                    user.setVerificationToken(token);
                    userRepository.save(user);

                     String verificationLink = "http://localhost:5173/verify?token=" + token;
                     emailServiceImp.sendVerificationEmail(user.getEmail(), verificationLink, user.getFirstName() + " " + user.getLastName());

                    return new AccountCreationResponse(true, "Account successfully created");
                })
                .orElseGet(() -> new AccountCreationResponse(false, "Invalid email address: " + request.getEmail()));
    }

    public AccountDetails getAccountDetails(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User id is invalid!"));
        DebitCard debitCard = debitCardRepository.findByEmail(user.getEmail())
                .orElseThrow(()-> new RuntimeException("Email address invalid!"));

        return getAccountDetails(user, debitCard);
    }

    private static AccountDetails getAccountDetails(Users user, DebitCard debitCard) {
        Address address = user.getAddress();
        return new AccountDetails(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getDob(),
                address.getAddressLine(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                debitCard.getAccountNumber()
        );
    }

    public DebitCardDetails getCardDetails(DebitCardDetailsRequest request) {
        DebitCard debitCard = debitCardRepository.findByPhoneEndingWith(request.getLastFourDigitsPhone())
                .orElseThrow(()-> new RuntimeException("Invalid Digit values"));

        return new DebitCardDetails(
                debitCard.getId(),
                debitCard.getCardNumber(),
                debitCard.getCardHolderName(),
                debitCard.getExpiryDate()
        );
    }

    public ForgotPasswordResponse sendOtpPassword(ForgotPasswordRequest request) {
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("Invalid Email"));

        String otp = String.valueOf(new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        user.setResetOtp(otp);
        user.setResetOtpExpiresAt(expiry);
        userRepository.save(user);

        emailServiceImp.sendOtpEmail(request.getEmail(), otp,user.getFirstName());
        return new ForgotPasswordResponse(true,"OTP sent your email address");
    }

    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("Invalid Email"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetOtp(null);
        user.setResetOtpExpiresAt(null);
        userRepository.save(user);
        return new ResetPasswordResponse(true, "Password Change Successfully!");
    }

    public ChangeEmailResponse changeEmail(ChangeEmailRequest request) {
        Users user = userRepository.findByPhoneEndingWith(request.getLastFourDigits()).orElseThrow(()-> new RuntimeException("Invalid Digits!"));
        DebitCard debitCard = debitCardRepository.findByPhoneEndingWith(request.getLastFourDigits()).orElseThrow(()-> new RuntimeException("Invalid Digits!"));
        List<SupportTicket> supportTicketList = supportTicketRepository.findByUserTicket_Id(user.getId());

        debitCard.setEmail(request.getEmail());
        user.setEmail(request.getEmail());

        for (SupportTicket ticket : supportTicketList) {
            ticket.setEmail(request.getEmail()); // assuming SupportTicket has `setEmail()`
        }


        userRepository.save(user);
        debitCardRepository.save(debitCard);
        supportTicketRepository.saveAll(supportTicketList);

        return new ChangeEmailResponse("Email updated successfully", true);
    }


    public GenericResponse initiatePhoneChange(ChangePhoneRequest request) {
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String otp = String.valueOf(new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        user.setResetOtp(otp);
        user.setResetOtpExpiresAt(expiry);
        userRepository.save(user);

        emailServiceImp.sendOtpNumChange(request.getEmail(), otp,user.getFirstName());
        return new GenericResponse("OTP sent to email", true);
    }

    public GenericResponse verifyOtpAndUpdatePhone(VerifyOtpRequest request, Principal principal) {
        Users users = userRepository.findByEmail(principal.getName()).orElseThrow(()-> new RuntimeException("Invalid user!"));
        DebitCard debitCard = debitCardRepository.findByEmail(users.getEmail()).orElseThrow(()-> new RuntimeException(""));
        if (!users.getResetOtp().equals(request.getOtp())) {
            return new GenericResponse("Invalid or expired OTP", false);
        }

        if (users.getResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
            return new GenericResponse("OTP expired",false);
        }
        debitCard.setPhone(request.getNewPhoneNumber());
        users.setPhone(request.getNewPhoneNumber());
        users.setResetOtp(null);
        users.setResetOtpExpiresAt(null);
        userRepository.save(users);
        debitCardRepository.save(debitCard);
        return new GenericResponse("Phone Number Successfully Changed!", true);
    }

    public GenericResponse changeAddressRequest(AddressChangeOtpRequest request) {
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("Invalid Email Address"));
        String otp = String.valueOf(new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        user.setResetOtp(otp);
        user.setResetOtpExpiresAt(expiry);
        userRepository.save(user);
        emailServiceImp.sendOtpAddressChange(user.getEmail(), otp, user.getFirstName());
        return new GenericResponse("Otp send successful",true);
    }

    public GenericResponse verifyOtpAndUpdateAddress(AddressChangeRequest request, Principal principal) {
        Users user = userRepository.findByEmail(principal.getName())
                .orElseThrow(()-> new RuntimeException("Invalid user!"));

        if (!user.getResetOtp().equals(request.getOtp())) {
            return new GenericResponse("Invalid or expired OTP", false);
        }

        if (user.getResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
            return new GenericResponse("OTP expired",false);
        }
        Address address = new Address();
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        user.setAddress(address);
        user.setResetOtpExpiresAt(null);
        user.setResetOtp(null);
        userRepository.save(user);
        return new GenericResponse("Address Details successfully updated!",true);
    }

    public ResponseVerifyOtp verifyOtp(VerifyOtp request) {
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(!user.getResetOtp().equals(request.getOtp())){
            return  new ResponseVerifyOtp(false,"Invalid Otp!");
        }
        if(!user.getResetOtpExpiresAt().isBefore(LocalDateTime.now())){
            return  new ResponseVerifyOtp(false,"Otp expires!");
        }
        return new ResponseVerifyOtp(true, "Otp Verified Successful!");
    }

    public UserProfileDTO getAccount(Principal principal) {
        Users user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .dob(user.getDob())
                .emailVerified(user.isEmailVerified())
                .accountCreated(user.isAccountCreated())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public AccountDetailsResponse account(Principal principal) {
        DebitCard debitCard = debitCardRepository.findByEmail(principal.getName()).orElseThrow(()-> new RuntimeException("Email not valid"));

        return new AccountDetailsResponse(
                debitCard.getId(),
                debitCard.getAccountNumber(),
                debitCard.getCardHolderName(),
                debitCard.getBalance(),
                debitCard.getIssuedAt(),
                debitCard.isPinSet()
        );
    }
}

