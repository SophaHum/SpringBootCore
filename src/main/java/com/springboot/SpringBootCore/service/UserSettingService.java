package com.springboot.SpringBootCore.service;

import com.springboot.SpringBootCore.model.UserSetting;
import com.springboot.SpringBootCore.repository.UserSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserSettingService {
    private final UserSettingRepository userSettingRepository;

    public UserSetting getSettings(Long userId) {
        return userSettingRepository.findById(userId)
                .orElse(UserSetting.builder().userId(userId).build());
    }

    public UserSetting updateSettings(UserSetting settings) {
        return userSettingRepository.save(settings);
    }
}
