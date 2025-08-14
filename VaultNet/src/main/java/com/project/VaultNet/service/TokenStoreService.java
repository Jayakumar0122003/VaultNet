package com.project.VaultNet.service;

import com.project.VaultNet.model.RefreshToken;
import com.project.VaultNet.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class TokenStoreService {
    private final RefreshTokenRepository refreshTokenRepository;

    public TokenStoreService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public void storeRefreshToken(String email, String token, long durationInDays) {
        RefreshToken refreshToken = new RefreshToken(
                token,
                email,
                Instant.now().plus(durationInDays, ChronoUnit.DAYS)
        );
        refreshTokenRepository.save(refreshToken);
    }

    public boolean isValidRefreshToken(String email, String token) {
        Optional<RefreshToken> storedToken = refreshTokenRepository.findByToken(token);
        System.out.println("Token:"+ storedToken.get().getToken());
        System.out.println("Token email:"+ storedToken.get().getEmail());
        System.out.println("Token expire:"+ storedToken.get().getExpiryDate());
        return storedToken.isPresent()
                && storedToken.get().getEmail().equals(email)
                && storedToken.get().getExpiryDate().isAfter(Instant.now());
    }

    @Transactional
    public void deleteRefreshToken(String token) {
        if (token == null || token.isEmpty()) return;

        try {
            refreshTokenRepository.deleteByToken(token);
        } catch (EmptyResultDataAccessException e) {
            // Token not found, ignore
            System.out.println("Refresh token not found: " + token);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete refresh token", e);
        }
    }

    public void deleteAllTokensForUser(String email) {
        refreshTokenRepository.deleteByEmail(email);
    }
}


