package br.com.sondsp.security;

import br.com.sondsp.entities.User;

public record UserAuthResult(
        User user,
        String token,
        String refreshToken
) {
}
