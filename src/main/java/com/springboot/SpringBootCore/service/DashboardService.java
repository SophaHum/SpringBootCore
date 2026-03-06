package com.springboot.SpringBootCore.service;

import com.springboot.SpringBootCore.repository.PermissionRepository;
import com.springboot.SpringBootCore.repository.RoleRepository;
import com.springboot.SpringBootCore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeRoles", roleRepository.count());
        stats.put("totalPermissions", permissionRepository.count());
        stats.put("activeSessions", 1024); // Placeholder for session management
        return stats;
    }

    public List<Map<String, String>> getRecentActivity() {
        // In a real app, this would come from an audit log table
        // For now, we'll return some semi-dynamic data based on users
        List<Map<String, String>> activity = new ArrayList<>();
        userRepository.findAll().stream().limit(5).forEach(user -> {
            Map<String, String> item = new HashMap<>();
            item.put("user", user.getFullName());
            item.put("action", "Logged into the system");
            item.put("time", user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : "Recently");
            item.put("icon", "user");
            activity.add(item);
        });
        return activity;
    }
}
