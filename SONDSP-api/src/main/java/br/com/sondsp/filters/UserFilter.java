package br.com.sondsp.filters;

import br.com.sondsp.entities.Role;

public record UserFilter(
        String name,
        Role role,
        String email,
        Boolean status
) {
}
