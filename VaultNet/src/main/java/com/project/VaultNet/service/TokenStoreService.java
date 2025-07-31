package com.project.VaultNet.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TokenStoreService {
    private final Map<String, String> refreshTokens = new HashMap<>();

    public void storeRefreshToken(String email, String token) {
        refreshTokens.put(email, token);
    }

    public boolean isValidRefreshToken(String email, String token) {
        return token.equals(refreshTokens.get(email));
    }

    public void deleteRefreshToken(String username) {
        refreshTokens.remove(username);
    }
}


