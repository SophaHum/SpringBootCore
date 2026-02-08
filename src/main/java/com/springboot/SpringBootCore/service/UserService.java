package com.springboot.SpringBootCore.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.springboot.SpringBootCore.model.User;
import com.springboot.SpringBootCore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.springboot.SpringBootCore.dto.UserRequest;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User createUser(UserRequest userRequest) {
        User user = new User();
        user.setUsername(userRequest.username());
        user.setFullName(userRequest.fullName());
        user.setEmail(userRequest.email());
        user.setPassword(userRequest.password());
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, UserRequest userRequest) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setFullName(userRequest.fullName());
        existingUser.setEmail(userRequest.email());
        existingUser.setPassword(userRequest.password());
        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
