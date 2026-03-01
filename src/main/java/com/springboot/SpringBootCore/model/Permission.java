package com.springboot.SpringBootCore.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "permissions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Permission {
    @Id
    private String id; // slug like 'users.view'
    private String name;
    private String description;
    private String category;
}
