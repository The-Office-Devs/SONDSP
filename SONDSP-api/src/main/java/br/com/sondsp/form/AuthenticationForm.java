package br.com.sondsp.form;

import jakarta.validation.constraints.NotEmpty;

import static br.com.sondsp.util.SystemMessages.EMPTY_LOGIN;
import static br.com.sondsp.util.SystemMessages.EMPTY_PASSWORD;

public record AuthenticationForm(
        @NotEmpty(message = EMPTY_LOGIN)
        String login,
        @NotEmpty(message = EMPTY_PASSWORD)
        String password,
        Boolean keepMeSigned
) {
}
