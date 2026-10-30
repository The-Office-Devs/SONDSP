package br.com.sondsp.dtos;

import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.Role;
import br.com.sondsp.entities.User;

import java.util.List;

public record RegisterDTO(
        String name,
        String registration,
        String role,
        List<String> roles,
        String email,
        List<String> permissions) {

    public RegisterDTO(
            String name,
            String registration,
            String role,
            String email,
            List<String> permissions) {
        this(name, registration, role, role != null ? List.of(role) : List.of(), email, permissions);
    }

    public RegisterDTO(User user) {
        this(
            user.getName(),
            user.getRegistration(),
            user.getRole() != null ? user.getRole().getName() : null,
            user.getRoles() != null
                ? user.getRoles().stream().map(Role::getName).sorted().toList()
                : List.of(),
            user.getEmail(),
            user.getPermissions() != null ?
                    user.getPermissions().stream().map(Permission::getPermission).sorted().toList() : List.of()
        );
    }
}
