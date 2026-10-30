package br.com.sondsp.dtos;

import br.com.sondsp.entities.Role;
import br.com.sondsp.entities.User;

import java.util.List;

public record UsersListDTO(
        Integer id,
        String name,
        String registration,
        String email,
        String role,
        List<String> roles,
        Boolean status,
        Boolean linked) {

    public UsersListDTO(
            Integer id,
            String name,
            String registration,
            String email,
            String role,
            Boolean status,
            Boolean linked) {
        this(id, name, registration, email, role, role != null ? List.of(role) : List.of(), status, linked);
    }

    public UsersListDTO(User user) {
        this(user, false);
    }

    public UsersListDTO(User user, boolean linked) {
        this(
                user.getId(),
                user.getName(),
                user.getRegistration(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getName() : null,
                user.getRoles() != null
                        ? user.getRoles().stream().map(Role::getName).sorted().toList()
                        : List.of(),
                user.getStatus(),
                linked
        );
    }
}
