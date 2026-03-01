package com.springboot.SpringBootCore.service;

import com.springboot.SpringBootCore.model.Role;
import com.springboot.SpringBootCore.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role getRoleById(Long id) {
        return roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
    }

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    public Role updateRole(Long id, Role roleDetails) {
        Role role = getRoleById(id);
        role.setName(roleDetails.getName());
        role.setDescription(roleDetails.getDescription());
        role.setColor(roleDetails.getColor());
        role.setPermissions(roleDetails.getPermissions());
        return roleRepository.save(role);
    }

    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}
