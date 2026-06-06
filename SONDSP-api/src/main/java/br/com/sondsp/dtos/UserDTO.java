package br.com.sondsp.dtos;

import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.User;

import java.util.List;

public record UserDTO(
        Integer id,
        String name,
        String registration,
        String email,
        String role,
        List<String> permissions) {
    public UserDTO(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getRegistration(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getName() : null,
                user.getPermissions() != null ?
                        user.getPermissions().stream().map(Permission::getPermission).toList() : List.of()
        );
    }
}
