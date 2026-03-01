package com.springboot.SpringBootCore.service;

import com.springboot.SpringBootCore.model.Permission;
import com.springboot.SpringBootCore.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    public Permission createPermission(Permission permission) {
        return permissionRepository.save(permission);
    }

    public Permission getPermissionById(String id) {
        return permissionRepository.findById(id).orElseThrow(() -> new RuntimeException("Permission not found"));
    }
}
