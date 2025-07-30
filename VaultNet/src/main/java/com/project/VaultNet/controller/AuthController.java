package com.project.VaultNet.controller;

import com.project.VaultNet.dto.AuthRequest;
import com.project.VaultNet.dto.RegisterRequest;
import com.project.VaultNet.dto.RegisterResponse;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.service.JwtService;
import com.project.VaultNet.service.TokenStoreService;
import com.project.VaultNet.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        Users newUser = userService.registerUser(request);

        RegisterResponse response = new RegisterResponse(
                newUser.getId(),
                newUser.getUsername(),
                newUser.getEmail(),
                newUser.getRole(),
                newUser.getFullName()
        );

        return ResponseEntity.ok(response);
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        // Authenticate user credentials
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Users user = userService.getUserByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateToken(user, 1000 * 60 * 15); // 15 min
        String refreshToken = jwtService.generateToken(user, 1000L * 60 * 60 * 24 * 7); // 7 days

        tokenStore.storeRefreshToken(user.getUsername(), refreshToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true) // set to false in dev
                .path("/api/auth/refresh")
                .sameSite("Strict") // or Lax
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        //  Return access token and role in body
        return ResponseEntity.ok(Map.of(
                "accessToken", accessToken,
                "role", user.getRole()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        String refreshToken = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(c -> "refreshToken".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing refresh token");
        }

        String username = jwtService.extractUsername(refreshToken);

        if (!tokenStore.isValidRefreshToken(username, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalid or revoked");
        }
        Users user = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateToken(user, 1000 * 60 * 15);
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear the refresh token cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok("Logged out");
    }




}
