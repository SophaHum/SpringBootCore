package com.springboot.SpringBootCore.dto;

import java.sql.Date;

public record TodoRequest(
        String title,
        String description,
        Date created_at,
        Date updated_at) {
}