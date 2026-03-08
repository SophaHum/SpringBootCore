package com.springboot.SpringBootCore.controller;

import com.springboot.SpringBootCore.dto.UserRequest;
import com.springboot.SpringBootCore.model.Role;
import com.springboot.SpringBootCore.model.User;
import com.springboot.SpringBootCore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;

import com.springboot.SpringBootCore.dto.ApiResponse;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('users.view')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('users.create')")
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(ApiResponse.success(userService.createUser(userRequest)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('users.view')")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('users.edit')")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long id, @RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(id, userRequest)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('users.delete')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAuthority('users.edit')")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.toggleUserStatus(id)));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/whoami")
    public ResponseEntity<ApiResponse<Map<String, Object>>> whoAmI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> details = new HashMap<>();

        if (auth == null) {
            details.put("authenticated", false);
            return ResponseEntity.ok(ApiResponse.success(details));
        }

        details.put("authenticated", auth.isAuthenticated());
        details.put("principal", auth.getPrincipal().getClass().getName());
        details.put("authorities", auth.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toList()));

        if (auth.getPrincipal() instanceof User) {
            User user = (User) auth.getPrincipal();
            details.put("email", user.getEmail());
            details.put("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        }

        return ResponseEntity.ok(ApiResponse.success(details));
    }
}
