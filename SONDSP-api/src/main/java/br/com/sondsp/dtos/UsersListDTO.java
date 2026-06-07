package br.com.sondsp.dtos;

import br.com.sondsp.entities.User;

public record UsersListDTO(
        Integer id,
        String name,
        String registration,
        String email) {
    public UsersListDTO(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getRegistration(),
                user.getEmail()
        );
    }
}
