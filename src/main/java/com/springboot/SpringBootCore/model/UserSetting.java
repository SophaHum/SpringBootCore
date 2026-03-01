package com.springboot.SpringBootCore.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_settings")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSetting {
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "general_settings", columnDefinition = "jsonb")
    private String generalSettings;

    @Column(name = "notification_settings", columnDefinition = "jsonb")
    private String notificationSettings;

    @Column(name = "security_settings", columnDefinition = "jsonb")
    private String securitySettings;

    @Column(name = "appearance_settings", columnDefinition = "jsonb")
    private String appearanceSettings;

    @Column(name = "oauth_settings", columnDefinition = "jsonb")
    private String oauthSettings;
}
