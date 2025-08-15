package com.project.VaultNet.service;

import com.project.VaultNet.customexceptions.ResourceAlreadyExistsException;
import com.project.VaultNet.customexceptions.ResourceNotFoundException;
import com.project.VaultNet.dto.AccountCreation.AccountCreationRequest;
import com.project.VaultNet.dto.AccountCreation.AccountCreationResponse;
import com.project.VaultNet.dto.AccountCreation.UserProfileDTO;
import com.project.VaultNet.dto.Admin.AdminDetailResponse;
import com.project.VaultNet.dto.Admin.AdminDetailsChange;
import com.project.VaultNet.dto.AuthDto.*;
import com.project.VaultNet.dto.ChangeEmail.*;
import com.project.VaultNet.dto.cardPinDto.*;
import com.project.VaultNet.dto.details.AccountDetails;
import com.project.VaultNet.dto.details.AccountDetailsResponse;
import com.project.VaultNet.dto.details.DebitCardDetails;
import com.project.VaultNet.dto.details.DebitCardDetailsRequest;
import com.project.VaultNet.model.*;
import com.project.VaultNet.repository.DebitCardRepository;
import com.project.VaultNet.repository.SupportTicketRepository;
import com.project.VaultNet.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.security.SecureRandom;
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
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new ResourceAlreadyExistsException("Email already exists");
            }
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new ResourceAlreadyExistsException("Username already exists");
            }

            Users user = Users.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(request.getRole())
                    .build();

            return userRepository.save(user);

        } catch (ResourceAlreadyExistsException e) {
            System.err.println("Validation error: " + e.getMessage());
            throw e; // Rethrow to global handler
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred while registering the user.");
        }
    }



    public Users getVerify(String token) {
        try {
            Users user = userRepository.findByVerificationToken(token)
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid Token!"));

            user.setEmailVerified(true);
            user.setVerificationToken(null);
            user.setVerificationLink(null);

            return userRepository.save(user);

        } catch (ResourceNotFoundException e) {
            System.err.println("Verification error: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred during verification.");
        }
    }


    public SetPinResponse setPin(SetPinRequest request, Principal principal) {
        try {
            Users user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Find card belonging to this user
            Optional<DebitCard> optionalCard = debitCardRepository
                    .findByUserIdAndPhoneEndingWith(user.getId(), request.getLastFourDigits());

            if (optionalCard.isEmpty()) {
                return new SetPinResponse(false, "Please provide register phone number digits.");
            }

            DebitCard card = optionalCard.get();

            if (card.isPinSet()) {
                return new SetPinResponse(false, "PIN is already set.");
            }

            // Validate PIN format (4-6 digits)
            if (!request.getPin().matches("\\d{4,6}")) {
                return new SetPinResponse(false, "PIN must be 4 to 6 digits.");
            }

            // Save hashed PIN
            card.setPinHash(passwordEncoder.encode(request.getPin()));
            card.setPinSet(true);
            debitCardRepository.save(card);

            return new SetPinResponse(true, "PIN set successfully.");

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to set PIN. Please try again later.", e);
        }
    }


    public ChangePinResponse changePin(ChangePinRequest changePinRequest, Principal principal) {
        try {
            DebitCard card = debitCardRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

            // Verify email matches the logged-in user's card
            if (!card.getEmail().equalsIgnoreCase(changePinRequest.getEmail())) {
                System.out.println();
                return new ChangePinResponse(false, "Email address does not match our records!");
            }

            // Verify old PIN
            if (!passwordEncoder.matches(changePinRequest.getOldPin(), card.getPinHash())) {
                return new ChangePinResponse(false, "Old PIN is incorrect!");
            }

            // Prevent old PIN == new PIN
            if (passwordEncoder.matches(changePinRequest.getNewPin(), card.getPinHash())) {
                return new ChangePinResponse(false, "New PIN cannot be the same as the old PIN!");
            }

            // Save new PIN
            String newHashedPin = passwordEncoder.encode(changePinRequest.getNewPin());
            card.setPinHash(newHashedPin);
            debitCardRepository.save(card);

            return new ChangePinResponse(true, "PIN changed successfully!");
        } catch (ResourceNotFoundException e) {
            throw e; // Controller will return 404
        } catch (Exception e) {
            throw new RuntimeException("Failed to change PIN. Please try again later.", e);
        }
    }

    @Transactional
    public ForgotPinResponse sendOtp(ForgotPinRequest request, Principal principal) {
        try {
            Optional<DebitCard> opt = debitCardRepository.findByEmail(principal.getName());
            if (opt.isEmpty()) {
                return new ForgotPinResponse(false, "Invalid session entry!");
            }

            DebitCard card = opt.get();

            if (!card.getEmail().equals(request.getEmail())) {
                return new ForgotPinResponse(false, "Please provide registered email address!");
            }

            // Generate 6-digit OTP
            String otpStr = String.format("%06d", new SecureRandom().nextInt(1_000_000));
            card.setOtp(otpStr);
            card.setOtpExpiresAt(LocalDateTime.now().plusMinutes(5));
            debitCardRepository.save(card);

            emailServiceImp.sendOtpForgotPin(card.getEmail(), otpStr, card.getCardHolderName());

            return new ForgotPinResponse(true, "OTP sent to your email address!");

        } catch (Exception e) {
            System.err.println("Error sending OTP: " + e.getMessage());
            return new ForgotPinResponse(false, "Failed to send OTP, try again later.");
        }
    }

    public VerifyPinOtpResponse verifyOtpPin(VerifyPinOtpRequest request, Principal principal) {
        try {
            DebitCard debitCard = debitCardRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

            if (debitCard.getOtp() == null || debitCard.getOtpExpiresAt() == null
                    || debitCard.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
                return new VerifyPinOtpResponse(false, "OTP expired");
            }

            if (!debitCard.getOtp().equals(request.getOtp())) { // Compare input OTP
                return new VerifyPinOtpResponse(false, "Invalid OTP");
            }

            // OTP correct → clear and save
            debitCard.setOtp(null);
            debitCard.setOtpExpiresAt(null);
            debitCardRepository.save(debitCard);

            return new VerifyPinOtpResponse(true, "OTP verified successfully");
        } catch (Exception e) {
            System.err.println("Error verifying OTP: " + e.getMessage());
            return new VerifyPinOtpResponse(false, "Failed to verify OTP. Please try again.");
        }
    }


    @Transactional
    public AccountCreationResponse createAccount(AccountCreationRequest request) {
        try {
            return userRepository.findByEmail(request.getEmail())
                    .map(user -> {
                        if (user.isAccountCreated()) {
                            return new AccountCreationResponse(false,
                                    "Account already exists for email: " + request.getEmail());
                        }

                        // Generate verification token
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

                        // Create verification link
                        String verificationLink = "http://localhost:5173/vaultnet-verify-account?token=" + token;
                        user.setVerificationLink(verificationLink);

                        userRepository.save(user);

                        // Send verification email
                        emailServiceImp.sendVerificationEmail(
                                user.getEmail(),
                                verificationLink,
                                user.getFirstName() + " " + user.getLastName()
                        );

                        return new AccountCreationResponse(true, "Account successfully created");
                    })
                    .orElseGet(() -> new AccountCreationResponse(false,
                            "Invalid email address: " + request.getEmail()));

        } catch (Exception e) {
            System.err.println("Failed to create account for email " + request.getEmail() + ": " + e.getMessage());
            return new AccountCreationResponse(false, "An error occurred while creating account. Please try again later.");
        }
    }


    public AccountDetails getAccountDetails(Long userId) {
        try {
            Users user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User ID is invalid: " + userId));

            DebitCard debitCard = debitCardRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("No debit card found for email: " + user.getEmail()));

            return getAccountDetails(user, debitCard);

        } catch (ResourceNotFoundException e) {
            throw e; // propagate to controller → 404 Not Found
        } catch (Exception e) {
            System.err.println("Failed to get account details for userId " + userId + ": " + e.getMessage());
            throw new RuntimeException("Unable to fetch account details. Please try again later.", e);
        }
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
        try {
            DebitCard debitCard = debitCardRepository.findByPhoneEndingWith(request.getLastFourDigitsPhone())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No debit card found matching the last digits: " + request.getLastFourDigitsPhone()
                    ));

            return new DebitCardDetails(
                    debitCard.getId(),
                    debitCard.getCardNumber(),
                    debitCard.getCardHolderName(),
                    debitCard.getExpiryDate()
            );

        } catch (ResourceNotFoundException e) {
            throw e; // propagate → 404 Not Found
        } catch (Exception e) {
            System.err.println("Failed to fetch debit card details: " + e.getMessage());
            throw new RuntimeException("Unable to fetch card details. Please try again later.", e);
        }
    }

    public ForgotPasswordResponse sendOtpPassword(ForgotPasswordRequest request) {
        try {
            Users user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid Email Address!"));

            String otp = String.format("%06d", new Random().nextInt(999_999)); // Always 6 digits
            LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

            user.setResetOtp(otp);
            user.setResetOtpExpiresAt(expiry);
            userRepository.save(user);

            emailServiceImp.sendOtpEmail(request.getEmail(), otp, user.getFirstName());

            return new ForgotPasswordResponse(true, "OTP sent to your email address");

        } catch (ResourceNotFoundException e) {
            throw e; // propagate → handled by controller → 404 Not Found
        } catch (Exception e) {
            System.err.println("Failed to send OTP to " + request.getEmail() + ": " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred while sending OTP. Please try again later.", e);
        }
    }


    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        try {
            Users user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User with given email not found"));

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setResetOtp(null);
            user.setResetOtpExpiresAt(null);
            userRepository.save(user);

            return new ResetPasswordResponse(true, "Password changed successfully!");
        }
        catch (ResourceNotFoundException e) {
            // Rethrow so it can be handled by ControllerAdvice
            throw e;
        }
        catch (Exception e) {
            // Wrap unexpected errors in a safe exception
            throw new RuntimeException("Failed to reset password. Please try again later.", e);
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email != null && email.matches(emailRegex);
    }


    public ChangeEmailResponse changeEmail(ChangeEmailRequest request,Principal principal) {
        try {
            if (!isValidEmail(request.getEmail())) {
                return new ChangeEmailResponse("Invalid email format", false);
            }

            if(userRepository.existsByEmail(request.getEmail())){
                return new ChangeEmailResponse("Email already exit!",false);
            }

            Users user = userRepository.findByPhoneEndingWith(request.getLastFourDigits())
                    .orElseThrow(() -> new ResourceNotFoundException("No user found with the provided digits!"));

            if(!user.getEmail().equals(principal.getName())){
                return new ChangeEmailResponse("Please enter your phone number last digits!",false);
            }

            if(user.getRole() == Role.CUSTOMER){
                DebitCard debitCard = debitCardRepository.findByEmail(user.getEmail())
                        .orElseThrow(() -> new ResourceNotFoundException("No debit card found with the provided digits!"));
                debitCard.setEmail(request.getEmail());
                debitCardRepository.save(debitCard);
            }

            if (user.getEmail().equalsIgnoreCase(request.getEmail())) {
                return new ChangeEmailResponse("New email cannot be same as old email", false);
            }

            List<SupportTicket> supportTicketList = supportTicketRepository.findByUserTicket_Id(user.getId());

            user.setEmail(request.getEmail());
            supportTicketList.forEach(ticket -> ticket.setEmail(request.getEmail()));

            userRepository.save(user);
            supportTicketRepository.saveAll(supportTicketList);

            return new ChangeEmailResponse("Email updated successfully", true);

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Failed to change email for digits " + request.getLastFourDigits() + ": " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred while updating email. Please try again later.", e);
        }
    }




    public GenericResponse initiatePhoneChange(ChangePhoneRequest request, Principal principal) {
        try {
            Users user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Provide register email address!"));

            if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
                return new GenericResponse("Invalid Email Address!", false);
            }
            // Generate 6-digit OTP
            String otp = String.format("%06d", new Random().nextInt(999_999));
            LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

            user.setResetOtp(otp);
            user.setResetOtpExpiresAt(expiry);
            userRepository.save(user);

            emailServiceImp.sendOtpNumChange(request.getEmail(), otp, user.getFirstName());

            return new GenericResponse("OTP sent to email", true);

        } catch (ResourceNotFoundException e) {
            throw e; // propagate → handled by controller → 404
        } catch (Exception e) {
            System.err.println("Failed to send OTP for phone change to " + request.getEmail() + ": " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred while sending OTP. Please try again later.", e);
        }
    }

    public GenericResponse verifyOtpAndUpdatePhone(VerifyOtpRequest request, Principal principal) {
        try {
            Users user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

            if(userRepository.existsByPhone(request.getNewPhoneNumber())){
                return new GenericResponse("Phone number already exit!", false);
            }

            if(user.getRole() == Role.CUSTOMER){
                DebitCard debitCard = debitCardRepository.findByEmail(user.getEmail())
                        .orElseThrow(() -> new ResourceNotFoundException("Associated debit card not found!"));
                debitCard.setPhone(request.getNewPhoneNumber());
                debitCardRepository.save(debitCard);
            }

            // Validate OTP
            if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
                return new GenericResponse("Invalid or expire OTP!", false);
            }

            if (user.getResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
                return new GenericResponse("OTP expired!", false);
            }

            // Update phone number
            user.setPhone(request.getNewPhoneNumber());

            // Clear OTP
            user.setResetOtp(null);
            user.setResetOtpExpiresAt(null);

            // Save changes
            userRepository.save(user);

            return new GenericResponse("Phone number successfully changed!", true);

        } catch (ResourceNotFoundException e) {
            throw e; // handled by controller → 404
        } catch (Exception e) {
            System.err.println("Failed to verify OTP and update phone for user " + principal.getName() + ": " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred while updating phone number. Please try again later.", e);
        }
    }

    public GenericResponse changeAddressRequest(AddressChangeOtpRequest request , Principal principal) {
        try {
            if(!request.getEmail().equals(principal.getName())){
                return new GenericResponse("Provide register email address!", false);
            }
            Users user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid email address"));

            // Generate 6-digit OTP
            String otp = String.format("%06d", new Random().nextInt(999999));
            LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

            // Save OTP details
            user.setResetOtp(otp);
            user.setResetOtpExpiresAt(expiry);
            userRepository.save(user);

            // Send OTP via email
            emailServiceImp.sendOtpAddressChange(user.getEmail(), otp, user.getFirstName());

            return new GenericResponse("OTP sent successfully", true);

        } catch (ResourceNotFoundException e) {
            throw e; // handled in controller → 404
        } catch (Exception e) {
            System.err.println("Failed to send OTP for address change to " + request.getEmail() + ": " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred while sending OTP for address change.", e);
        }
    }

    public GenericResponse verifyOtpAndUpdateAddress(AddressChangeRequest request, Principal principal) {
        try {
            Users user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (!request.getOtp().equals(user.getResetOtp())) {
                return new GenericResponse("Invalid or expired OTP", false);
            }

            if (user.getResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
                return new GenericResponse("OTP expired", false);
            }

            // Update address
            Address address = new Address();
            address.setAddressLine(request.getAddressLine());
            address.setCity(request.getCity());
            address.setState(request.getState());
            address.setPostalCode(request.getPostalCode());
            user.setAddress(address);

            // Clear OTP
            user.setResetOtp(null);
            user.setResetOtpExpiresAt(null);

            userRepository.save(user);

            return new GenericResponse("Address details successfully updated!", true);

        } catch (ResourceNotFoundException e) {
            throw e; // handled in controller → 404
        } catch (Exception e) {
            System.err.println("Failed to verify OTP and update address for user " + principal.getName() + ": " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred while updating address.", e);
        }
    }


    public ResponseVerifyOtp verifyOtp(VerifyOtp request) {
        try {
            Users user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
                return new ResponseVerifyOtp(false, "Invalid OTP!");
            }

            if (user.getResetOtpExpiresAt() == null || user.getResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
                return new ResponseVerifyOtp(false, "OTP expired!");
            }

            return new ResponseVerifyOtp(true, "OTP Verified Successfully!");
        } catch (ResourceNotFoundException e) {
            return new ResponseVerifyOtp(false, e.getMessage());
        } catch (Exception e) {
            return new ResponseVerifyOtp(false, "An unexpected error occurred: " + e.getMessage());
        }
    }


    public UserProfileDTO getAccount(Principal principal) {
        try {
            Users user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + principal.getName()));

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
                    .verificationLink(user.getVerificationLink())
                    .createdAt(user.getCreatedAt())
                    .build();

        } catch (ResourceNotFoundException e) {
            throw e; // propagate to controller → 404 Not Found
        } catch (Exception e) {
            System.err.println("Failed to fetch user profile for email " + principal.getName() + ": " + e.getMessage());
            throw new RuntimeException("Unable to fetch user profile. Please try again later.", e);
        }
    }


    public AccountDetailsResponse account(Principal principal) {
        try {
            DebitCard debitCard = debitCardRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("No debit card found for email: " + principal.getName()));

            return new AccountDetailsResponse(
                    debitCard.getId(),
                    debitCard.getAccountNumber(),
                    debitCard.getCardHolderName(),
                    debitCard.getBalance(),
                    debitCard.getIssuedAt(),
                    debitCard.isPinSet()
            );

        } catch (ResourceNotFoundException e) {
            throw e; // propagate to controller → 404 Not Found
        } catch (Exception e) {
            System.err.println("Failed to fetch account details for email " + principal.getName() + ": " + e.getMessage());
            throw new RuntimeException("Unable to fetch account details. Please try again later.", e);
        }
    }


    public ChangeAccountPasswordResponse changeAccountPassword(ChangeAccountPassword request, Principal principal) {
        try {
            Users user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid session!"));

            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                return new ChangeAccountPasswordResponse(false, "Old password does not match!");
            }

            if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                return new ChangeAccountPasswordResponse(false, "New password cannot be the same as the old password!");
            }


            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return new ChangeAccountPasswordResponse(true, "Password changed successfully!");
        } catch (ResourceNotFoundException e) {
            throw e; // Controller will handle as 404
        } catch (Exception e) {
            System.err.println("Error changing password for user " + principal.getName() + ": " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred while changing the password.", e);
        }
    }

    public ResetPinResponse resetPin(ResetPinRequest request, Principal principal) {
        try {
            DebitCard debitCard = debitCardRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid session"));

            // Check if new PIN is same as old PIN
            if (passwordEncoder.matches(request.getNewPin(), debitCard.getPinHash())) {
                return new ResetPinResponse(false, "New PIN cannot be the same as the old PIN");
            }

            // Encode new PIN and update
            String hashedPin = passwordEncoder.encode(request.getNewPin());
            debitCard.setPinHash(hashedPin);
            debitCardRepository.save(debitCard);

            return new ResetPinResponse(true, "PIN reset successful");

        } catch (ResourceNotFoundException e) {
            // Rethrow for global exception handling (returns 404)
            throw e;
        } catch (Exception e) {
            // Wrap unexpected errors
            throw new RuntimeException("Failed to reset PIN. Please try again later.", e);
        }
    }













    public AdminDetailResponse getAdminDetails(Principal principal) {
        Users users = userRepository.findByEmail(principal.getName())
                .orElseThrow(()-> new ResourceNotFoundException("User not found!"));
        AdminDetailResponse response = new AdminDetailResponse(
                users.getId(),
                users.getEmail(),
                users.getUsername(),
                users.getRole(),
                users.getFirstName(),
                users.getLastName(),
                users.getPhone(),
                users.getAddress(),
                users.getDob(),
                users.isEmailVerified(),
                users.getVerificationLink(),
                users.getCreatedAt()
        );

        return response;
    }

    public GenericResponse verifyOtpAndChangeDetails(AdminDetailsChange request, Principal principal) {
        try {
            Users user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (!request.getOtp().equals(user.getResetOtp())) {
                return new GenericResponse("Invalid or expired OTP", false);
            }

            if (user.getResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
                return new GenericResponse("OTP expired", false);
            }

            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhone(request.getPhone());

            // Update address
            Address address = new Address();
            address.setAddressLine(request.getAddressLine());
            address.setCity(request.getCity());
            address.setState(request.getState());
            address.setPostalCode(request.getPostalCode());
            user.setAddress(address);

            // Clear OTP
            user.setResetOtp(null);
            user.setResetOtpExpiresAt(null);

            userRepository.save(user);

            return new GenericResponse("Address details successfully updated!", true);

        } catch (ResourceNotFoundException e) {
            throw e; // handled in controller → 404
        } catch (Exception e) {
            System.err.println("Failed to verify OTP and update address for user " + principal.getName() + ": " + e.getMessage());
            throw new RuntimeException("An unexpected error occurred while updating address.", e);
        }
    }
}

