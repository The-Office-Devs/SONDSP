package br.com.sondsp.dtos;

import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.User;

import java.util.List;

public record RegisterDTO(
        String name,
        String registration,
        String role,
        String email,
        String password,
        List<String> permissions) {
    public RegisterDTO(User user) {
        this(
            user.getName(),
            user.getRegistration(),
            user.getRole() != null ? user.getRole().getName() : null,
            user.getEmail(),
            user.getPassword(),
            user.getPermissions() != null ?
                    user.getPermissions().stream().map(Permission::getPermission).toList() : List.of()
        );
    }
}
