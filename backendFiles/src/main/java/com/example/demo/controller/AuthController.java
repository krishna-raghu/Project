package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    // -------SIGNUP-------//
    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {

        User user = new User();

        user.setUsername(request.getUsername());

        user.setEmail(request.getEmail());

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String hashedPassword = encoder.encode(request.getPassword());

        user.setPasswordHash(hashedPassword);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return "Signup Success";
    }

    // ---------------- LOGIN ----------------

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(
                request.getEmail());

        if (userOptional.isEmpty()) {

            return "User Not Found";
        }

        User user = userOptional.get();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        boolean match = encoder.matches(
                request.getPassword(),
                user.getPasswordHash());

        if (match) {

            return "Login Success";
        }

        return "Invalid Password";
    }
}
