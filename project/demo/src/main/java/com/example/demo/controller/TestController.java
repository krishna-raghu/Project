package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.UUID;

@RestController
// @RequestMapping("/test")
@RequestMapping("/api/v1/public")
@CrossOrigin(origins = "*")
public class TestController {

    // @Autowired
    // private UserRepository userRepository;

    // @PostMapping("/create-profile")
    // public User createTestingProfile(
    // @RequestParam String id,
    // @RequestParam String fullName,
    // @RequestParam String username) {

    // User user = new User();

    // user.setId(UUID.fromString(id));
    // user.setFullName(fullName);
    // user.setUsername(username);
    // user.setRole("user");

    // return userRepository.save(user);
    // }

    @GetMapping("/health")
    public String health() {
        return "Backend Running";
    }
}