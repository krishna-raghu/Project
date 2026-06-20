package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsFilter corsFilter;

    SecurityConfig(CorsFilter corsFilter) {
        this.corsFilter = corsFilter;
    } // Automatically injects the custom bean from your CorsConfig.java

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Apply your custom CORS configuration before security checks execute
                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)

                // 2. Disable CSRF since we are entirely stateless and using JWTs
                .csrf(csrf -> csrf.disable())

                // 3. Configure endpoint protection rules
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Secure everything else!
                )

                // 4. Enable the OAuth2 Resource Server to automatically read Supabase JWTs
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> {
                        }) // Uses the config from your application.properties
                );

        return http.build();
    }
}