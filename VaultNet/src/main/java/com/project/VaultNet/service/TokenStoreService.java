package com.project.VaultNet.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TokenStoreService {
    private final Map<String, String> refreshTokens = new HashMap<>();

    public void storeRefreshToken(String username, String token) {
        refreshTokens.put(username, token);
    }

    public boolean isValidRefreshToken(String username, String token) {
        return token.equals(refreshTokens.get(username));
    }

    public void deleteRefreshToken(String username) {
        refreshTokens.remove(username);
    }
}


