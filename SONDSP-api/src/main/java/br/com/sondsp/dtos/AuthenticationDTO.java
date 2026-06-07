package br.com.sondsp.dtos;

import br.com.sondsp.security.UserAuthResult;

public record AuthenticationDTO(
        String login,
        String token) {
    public AuthenticationDTO(UserAuthResult userAuth) {
        this (
                userAuth.user().getEmail(),
                userAuth.token()
        );
    }
}
