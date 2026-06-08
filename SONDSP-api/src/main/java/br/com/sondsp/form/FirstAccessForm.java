package br.com.sondsp.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import static br.com.sondsp.util.SystemMessages.*;

public record FirstAccessForm(
        @Email
        @NotBlank(message = EMPTY_EMAIL)
        String email,
        @NotBlank(message = EMPTY_REGISTRATION)
        String registration,
        @NotBlank(message = EMPTY_PASSWORD)
        String password
) {
}
