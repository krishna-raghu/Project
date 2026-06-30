package com.example.demo.dto;

public class UserProfileResponse {

    private String fullName;
    private String email;
    private String role;

    public UserProfileResponse() {}

    public UserProfileResponse(
            String fullName,
            String email,
            String role) {

        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}