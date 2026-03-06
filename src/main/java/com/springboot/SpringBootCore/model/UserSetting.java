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

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "general_settings", columnDefinition = "jsonb")
    private java.util.Map<String, Object> generalSettings;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "notification_settings", columnDefinition = "jsonb")
    private java.util.Map<String, Object> notificationSettings;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "security_settings", columnDefinition = "jsonb")
    private java.util.Map<String, Object> securitySettings;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "appearance_settings", columnDefinition = "jsonb")
    private java.util.Map<String, Object> appearanceSettings;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "oauth_settings", columnDefinition = "jsonb")
    private java.util.Map<String, Object> oauthSettings;
}
