package com.project.VaultNet.customexceptions;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Email or password does not match");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
