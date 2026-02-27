package com.springboot.SpringBootCore.dto;

public record UserRequest(
                String username,
                String name,
                String email,
                String password) {
}
