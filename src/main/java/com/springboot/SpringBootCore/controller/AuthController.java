package com.springboot.SpringBootCore.controller;

import com.springboot.SpringBootCore.dto.LoginResponse;
import com.springboot.SpringBootCore.config.JwtUtils;
import com.springboot.SpringBootCore.dto.LoginRequest;
import com.springboot.SpringBootCore.dto.UserRequest;
import com.springboot.SpringBootCore.model.User;
import com.springboot.SpringBootCore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import com.springboot.SpringBootCore.dto.ApiResponse;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.login(loginRequest.email(), loginRequest.password());
            String token = jwtUtils.generateToken(user.getEmail());
            return ResponseEntity.ok(ApiResponse.success(new LoginResponse(token, user)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody UserRequest userRequest) {
        try {
            User user = userService.createUser(userRequest);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }
}
