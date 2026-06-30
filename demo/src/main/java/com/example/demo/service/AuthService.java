package com.example.demo.service;

import com.example.demo.dto.OAuthSignupRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.UserProfileResponse;
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

        // 1. If they already exist via Supabase UID, they are just logging back in!
        if (userRepository.existsBySupabaseUid(request.getSupabaseUid())) {
            return "USER_LOGGED_IN";
        }

        // 2. What if they signed up with Email/Password before, and are now clicking "Sign in with Google"?
        // Let's check by email so we don't create a duplicate account.
        java.util.Optional<User> existingUserByEmail = userRepository.findByEmail(request.getEmail());
        if (existingUserByEmail.isPresent()) {
            User user = existingUserByEmail.get();
            // Link their existing account to their Supabase UID
            user.setSupabaseUid(request.getSupabaseUid());
            userRepository.save(user);
            return "USER_LINKED_AND_LOGGED_IN";
        }

        // 3. Completely new OAuth User - Create them safely
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setSupabaseUid(request.getSupabaseUid());

        // Your smart fallback username generation
        user.setUsername(request.getEmail().split("@")[0] + System.currentTimeMillis());
        user.setPasswordHash(passwordEncoder.encode("OAUTH_USER"));

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