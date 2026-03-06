package com.springboot.SpringBootCore.service;

import com.springboot.SpringBootCore.dto.UserRequest;
import com.springboot.SpringBootCore.model.Role;
import com.springboot.SpringBootCore.model.User;
import com.springboot.SpringBootCore.repository.RoleRepository;
import com.springboot.SpringBootCore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(UserRequest userRequest) {
        String username = userRequest.username() != null ? userRequest.username() : userRequest.email();

        if (userRepository.findByEmail(userRequest.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(username)
                .email(userRequest.email())
                .fullName(userRequest.name())
                .password(passwordEncoder.encode(userRequest.password()))
                .status(userRequest.status() != null ? userRequest.status() : "Active")
                .build();

        if (userRequest.roleIds() != null && !userRequest.roleIds().isEmpty()) {
            Set<Role> roles = userRequest.roleIds().stream()
                    .map(id -> roleRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + id)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        } else {
            // Default to Viewer role if it exists
            roleRepository.findByName("Viewer").ifPresent(role -> user.setRoles(Set.of(role)));
        }

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateUser(Long id, UserRequest userRequest) {
        User user = getUserById(id);
        user.setFullName(userRequest.name());
        user.setEmail(userRequest.email());
        user.setStatus(userRequest.status());

        if (userRequest.password() != null && !userRequest.password().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequest.password()));
        }

        if (userRequest.roleIds() != null) {
            Set<Role> roles = userRequest.roleIds().stream()
                    .map(rid -> roleRepository.findById(rid)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + rid)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        String newStatus = "Active".equals(user.getStatus()) ? "Inactive" : "Active";
        user.setStatus(newStatus);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("User account is " + user.getStatus());
        }

        user.setLastLoginAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}
