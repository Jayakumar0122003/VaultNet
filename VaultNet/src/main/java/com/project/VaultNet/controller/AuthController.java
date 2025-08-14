package com.project.VaultNet.controller;

import com.project.VaultNet.customexceptions.ResourceNotFoundException;
import com.project.VaultNet.dto.AuthDto.*;
import com.project.VaultNet.model.Role;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.service.DebitCardService;
import com.project.VaultNet.service.JwtService;
import com.project.VaultNet.service.TokenStoreService;
import com.project.VaultNet.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    JwtService jwtService;

    @Autowired
    UserService userService;

    @Autowired
    TokenStoreService tokenStore;

    @Autowired
    DebitCardService debitCardService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        Users savedUser = userService.registerUser(request); // <- If something breaks here, 500 is thrown

        RegisterResponse response = new RegisterResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        try {
            // Authenticate the user
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Get user
            Users user = userService.getUserByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Generate tokens
            String accessToken = jwtService.generateToken(user, 1000L * 60 * 15);
            String refreshToken = jwtService.generateToken(user, 1000L * 60 * 60 * 24 * 7);

            // Store refresh token
            tokenStore.storeRefreshToken(user.getEmail(), refreshToken, 7);

            // Create refresh token cookie
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(false)      // set true in production
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)
                    .build();
            response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());

            // Return success response
            return ResponseEntity.ok(Map.of(
                    "accessToken", accessToken,
                    "role", user.getRole()
            ));

        } catch (BadCredentialsException ex) {
            // Invalid email/password
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Login failed: Please check your credential!"));

        } catch (ResourceNotFoundException ex) {
            // User not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));

        } catch (Exception ex) {
            // Any other exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + ex.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            ForgotPasswordResponse response = userService.sendOtpPassword(request);
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
            System.err.println("Failed to send OTP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An error occurred while sending OTP."
                    ));
        }
    }



    @PostMapping("/verify-otp")
    public ResponseEntity<ResponseVerifyOtp> verifyOtp(@RequestBody VerifyOtp request) {
        ResponseVerifyOtp result = userService.verifyOtp(request);

        if (!result.isSuccess()) {
            // If OTP failed due to invalid or expired
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST) // 400 for invalid input
                    .body(result);
        }

        return ResponseEntity.ok(result); // 200 for success
    }


    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        ResetPasswordResponse response = userService.resetPassword(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) {
        Users user = userService.getVerify(token);

        if (user.getRole() == Role.CUSTOMER) {
            debitCardService.sendVirtualCardEmail(
                    user.getEmail(),
                    user.getFirstName() + " " + user.getLastName(),
                    user.getPhone()
            );
        }

        return ResponseEntity.ok("Email verified successfully. You can now log in.");
    }



    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        String refreshToken = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(c -> "refreshToken".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
        System.out.println("Refresh Token:"+ refreshToken);
        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing refresh token");
        }

        String email = jwtService.extractUsername(refreshToken);

        if (!tokenStore.isValidRefreshToken(email, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalid or revoked");
        }

        Users user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateToken(user, 1000 * 60 * 15);
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }



    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;

        // Extract refresh token from cookies
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        // Delete token from DB if exists
        if (refreshToken != null && !refreshToken.isEmpty()) {
            tokenStore.deleteRefreshToken(refreshToken);
        }

        // Clear the cookie in browser
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // set true in production with HTTPS
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Return structured response
        Map<String, Object> body = Map.of(
                "success", true,
                "message", "Logged out successfully"
        );

        return ResponseEntity.ok(body);
    }







}
