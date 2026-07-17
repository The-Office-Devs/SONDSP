package br.com.sondsp.dtos;

import br.com.sondsp.entities.User;

public record UsersListDTO(
        Integer id,
        String name,
        String registration,
        String email,
        String role,
        Boolean status,
        Boolean linked) {

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
                user.getStatus(),
                linked
        );
    }
}
