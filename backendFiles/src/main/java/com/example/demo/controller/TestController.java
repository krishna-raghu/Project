package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.Neo4jTestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Neo4jTestService neo4jTestService;

    // Test Backend
    @GetMapping
    public String test() {
        return "Backend Connected Successfully";
    }

    // Insert User into PostgreSQL
    @PostMapping("/user")
    public User createUser() {

        User user = new User();

        user.setUsername("abc");
        user.setEmail("abc@test.com");
        user.setPasswordHash("abc123");

        return userRepository.save(user);
    }

    // Fetch all users from PostgreSQL
    @GetMapping("/users")
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/neo4j")
    public String testNeo4j() {

        neo4jTestService.createTestNode();

        return "Node Created Successfully";
    }
}
