package com.example.demo.service;

import com.example.demo.dto.SignupRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.dto.OAuthSignupRequest;
import com.example.demo.dto.UserProfileResponse;


@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    // for email users to go in users table
    public String signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));

        user.setSupabaseUid(
                request.getSupabaseUid());

        userRepository.save(user);
        return "Signup Success";
    }

    // for supabase users to go in users table
    public String oauthSignup(OAuthSignupRequest request) {

        if (userRepository.existsBySupabaseUid(
                request.getSupabaseUid())) {

            return "USER_ALREADY_EXISTS";
        }

        User user = new User();

        user.setFullName(request.getFullName());

        user.setEmail(request.getEmail());

        user.setSupabaseUid(request.getSupabaseUid());

        user.setUsername(
                request.getEmail().split("@")[0]
                        + System.currentTimeMillis());

        user.setPasswordHash(
                passwordEncoder.encode("OAUTH_USER"));

        userRepository.save(user);

        return "USER_CREATED";
    }

    //supabaseUid -> find user in DB -> create response DTO  ->   send to React
    public UserProfileResponse getUserProfile(
            String supabaseUid) {

        User user = userRepository
                .findBySupabaseUid(supabaseUid)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return new UserProfileResponse(
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

}