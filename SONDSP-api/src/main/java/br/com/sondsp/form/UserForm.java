package br.com.sondsp.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

public record UserForm(
        @Email(message = INVALID_EMAIL_FORMAT)
        @NotEmpty(message = EMPTY_EMAIL)
        String email,
        @NotEmpty(message = EMPTY_REGISTRATION)
        String registration,
        @NotEmpty(message = EMPTY_NAME)
        String name,
        String role,
        @NotEmpty(message = EMPTY_STATUS)
        Boolean status,
        List<String> permissions) {
    public UserForm {
        registration = registration.trim();
        name = name.trim();

        role = role != null ? role.trim() : null;

        permissions = permissions != null ?
                permissions.stream()
                        .map(p -> p != null ? p.trim() : null)
                        .toList()
                : null;
    }
}
