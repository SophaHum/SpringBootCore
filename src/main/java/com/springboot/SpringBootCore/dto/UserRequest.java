package com.springboot.SpringBootCore.dto;

import java.util.List;

public record UserRequest(
                String username,
                String name,
                String email,
                String password,
                String status,
                List<Long> roleIds) {
}
