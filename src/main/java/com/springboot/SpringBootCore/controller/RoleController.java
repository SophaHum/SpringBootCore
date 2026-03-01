package com.springboot.SpringBootCore.controller;

import com.springboot.SpringBootCore.model.Role;
import com.springboot.SpringBootCore.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

import com.springboot.SpringBootCore.dto.ApiResponse;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasAuthority('roles.view')")
    public ResponseEntity<ApiResponse<List<Role>>> getAllRoles() {
        return ResponseEntity.ok(ApiResponse.success(roleService.getAllRoles()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('roles.create')")
    public ResponseEntity<ApiResponse<Role>> createRole(@RequestBody Role role) {
        return ResponseEntity.ok(ApiResponse.success(roleService.createRole(role)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('roles.edit')")
    public ResponseEntity<ApiResponse<Role>> updateRole(@PathVariable Long id, @RequestBody Role role) {
        return ResponseEntity.ok(ApiResponse.success(roleService.updateRole(id, role)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('roles.delete')")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
