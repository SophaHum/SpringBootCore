package com.springboot.SpringBootCore.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.springboot.SpringBootCore.dto.UserRequest;
import com.springboot.SpringBootCore.model.User;
import com.springboot.SpringBootCore.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(UserRequest userRequest) {
        User user = new User();
        user.setUsername(userRequest.username() != null ? userRequest.username() : userRequest.email());
        user.setFullName(userRequest.name());
        user.setEmail(userRequest.email());
        user.setPassword(passwordEncoder.encode(userRequest.password()));
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, UserRequest userRequest) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setFullName(userRequest.name());
        existingUser.setEmail(userRequest.email());
        existingUser.setPassword(passwordEncoder.encode(userRequest.password()));
        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean matches = false;
        String storedPassword = user.getPassword();

        // Check if stored password is BCrypt hashed (starts with $2a$ or $2b$)
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
            matches = passwordEncoder.matches(password, storedPassword);
        } else {
            // Fallback for plain-text passwords
            matches = storedPassword.equals(password);

            // Transparent migration: if plain-text matches, hash and update
            if (matches) {
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
            }
        }

        if (!matches) {
            throw new RuntimeException("Invalid email or password");
        }
        return user;
    }
}
