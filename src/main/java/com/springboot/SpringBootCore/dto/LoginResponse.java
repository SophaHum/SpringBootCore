package com.springboot.SpringBootCore.dto;

import com.springboot.SpringBootCore.model.User;

public record LoginResponse(String token, User user) {
}
