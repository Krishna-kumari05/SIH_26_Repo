package com.backend.auth.controller;

import com.backend.auth.dto.*;
import com.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        authService.signup(request);
        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Signup successful. OTP sent to your email."
                )
        );
    }

    @PostMapping("/verify-signup")
    public ResponseEntity<?> verifySignup(@Valid @RequestBody VerifyOtpRequest request) {
        authService.verifySignup(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Email verified successfully. Account activated."
                )
        );
    }

    @PostMapping("/resend-signup-otp")
    public ResponseEntity<?> resendSignupOtp(@RequestBody Map<String, String> request) {
        authService.resendSignupOtp(request.get("email"));

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "A new OTP has been sent to your email."
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {
        authService.login(request);
        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Credentials verified. OTP sent to your email."
                )
        );
    }

    @PostMapping("/verify-login")
    public ResponseEntity<AuthResponse> verifyLogin(
            @Valid @RequestBody VerifyOtpRequest request,
            @RequestHeader("X-Device-Id") String deviceId,
            @RequestHeader(value = "X-Device-Name", defaultValue = "Unknown Device") String deviceName,
            @RequestHeader(value = "X-Platform", defaultValue = "WEB") String platform
    ) {
        AuthResponse response = authService.verifyLogin(
                request.getEmail(),
                request.getOtp(),
                deviceId,
                deviceName,
                platform
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        AuthResponse response =
                authService.refreshAccessToken(
                        request.getRefreshToken()
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

        authService.forgotPassword(request.get("email"));

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password reset OTP sent to your email."
                )
        );
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@RequestBody Map<String, String> request) {

        String resetToken = authService.verifyPasswordResetOtp(
                request.get("email"),
                request.get("otp")
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "OTP verified successfully.",
                        "resetToken",
                        resetToken
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {

        authService.resetPassword(
                request.get("email"),
                request.get("resetToken"),
                request.get("newPassword")
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password reset successfully."
                )
        );
    }
}