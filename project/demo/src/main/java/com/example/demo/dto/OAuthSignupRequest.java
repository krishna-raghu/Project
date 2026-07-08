package com.example.demo.dto;

public class OAuthSignupRequest {

    private String fullName;
    private String email;
    private String supabaseUid;

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

    public String getSupabaseUid() {
        return supabaseUid;
    }

    public void setSupabaseUid(String supabaseUid) {
        this.supabaseUid = supabaseUid;
    }
}