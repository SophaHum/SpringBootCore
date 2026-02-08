package com.springboot.SpringBootCore.dto;

import java.time.LocalDateTime;

public record TodoRequest(
                String title,
                String description,
                LocalDateTime created_at,
                LocalDateTime updated_at) {
}