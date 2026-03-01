package com.springboot.SpringBootCore.controller;

import com.springboot.SpringBootCore.model.Permission;
import com.springboot.SpringBootCore.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

import com.springboot.SpringBootCore.dto.ApiResponse;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {
    private final PermissionService permissionService;

    @GetMapping
    @PreAuthorize("hasAuthority('roles.view')") // Viewing permissions usually tied to role management
    public ResponseEntity<ApiResponse<List<Permission>>> getAllPermissions() {
        return ResponseEntity.ok(ApiResponse.success(permissionService.getAllPermissions()));
    }

    @PostMapping
    @PreAuthorize("hasRole('Super Admin')") // Only Super Admin can create new base permissions
    public ResponseEntity<ApiResponse<Permission>> createPermission(@RequestBody Permission permission) {
        return ResponseEntity.ok(ApiResponse.success(permissionService.createPermission(permission)));
    }
}
