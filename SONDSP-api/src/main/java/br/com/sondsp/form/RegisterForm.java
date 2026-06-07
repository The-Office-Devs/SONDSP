package br.com.sondsp.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

public record RegisterForm(
        @NotBlank(message = EMPTY_NAME)
        String name,
        @NotBlank(message = EMPTY_REGISTRATION)
        String registration,
        @NotBlank(message = EMPTY_ROLE)
        String role,
        @Email(message = INVALID_EMAIL_FORMAT)
        @NotBlank(message = EMPTY_EMAIL)
        String email,
        @NotBlank(message = EMPTY_PASSWORD)
        String password,
        @NotEmpty(message = EMPTY_PERMISSIONS)
        List<@NotBlank(message = EMPTY_PERMISISON)String> permissions
) {
}
