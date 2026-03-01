package com.springboot.SpringBootCore.controller;

import com.springboot.SpringBootCore.model.User;
import com.springboot.SpringBootCore.model.UserSetting;
import com.springboot.SpringBootCore.service.UserSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.springboot.SpringBootCore.dto.ApiResponse;
@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class UserSettingController {
    private final UserSettingService userSettingService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserSetting>> getMySettings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(userSettingService.getSettings(user.getId())));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserSetting>> updateMySettings(@RequestBody UserSetting settings) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        User user = (User) auth.getPrincipal();
        settings.setUserId(user.getId());
        settings.setUser(user);
        return ResponseEntity.ok(ApiResponse.success(userSettingService.updateSettings(settings)));
    }
}
