package br.com.sondsp.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

public record RegisterForm(
        @NotEmpty(message = EMPTY_NAME)
        String name,
        @NotEmpty(message = EMPTY_REGISTRATION)
        String registration,
        @NotEmpty(message = EMPTY_ROLE)
        String role,
        @Email(message = INVALID_EMAIL_FORMAT)
        @NotEmpty(message = EMPTY_EMAIL)
        String email,
        @NotEmpty(message = EMPTY_PASSWORD)
        String password,
        @NotEmpty(message = EMPTY_PERMISSIONS)
        List<String> permissions
) {
}
