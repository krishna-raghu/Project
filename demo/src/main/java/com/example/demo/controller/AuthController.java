package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.OAuthSignupRequest;
import com.example.demo.dto.UserProfileResponse;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public String signup(
            @RequestBody SignupRequest request) {

        return authService.signup(request);
    }

    @PostMapping("/login")
    public String login(
            @RequestBody LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow();

        if (passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

            return "LOGIN_SUCCESS";
        }

        return "INVALID_CREDENTIALS";
    }

    @PostMapping("/oauth-signup")
    public String oauthSignup(
            @RequestBody OAuthSignupRequest request) {

        return authService.oauthSignup(request);
    }


    @GetMapping("/user/{supabaseUid}")
    public UserProfileResponse getUserProfile(
            @PathVariable String supabaseUid) {

        return authService.getUserProfile(
                supabaseUid);
    }
}