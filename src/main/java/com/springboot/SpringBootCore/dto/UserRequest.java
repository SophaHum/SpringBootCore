package com.springboot.SpringBootCore.dto;

public record UserRequest(
        String username,
        String fullName,
        String email,
        String password) {

}
