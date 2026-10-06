package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;

import static br.com.sondsp.util.SystemMessages.EMPTY_EMAIL;
import static br.com.sondsp.util.SystemMessages.EMPTY_PASSWORD;

public record AuthenticationForm(
        @NotBlank(message = EMPTY_EMAIL)
        String login,
        @NotBlank(message = EMPTY_PASSWORD)
        String password
) {
}
