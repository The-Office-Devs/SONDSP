package br.com.sondsp.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

public record UserForm(
        @Email(message = INVALID_EMAIL_FORMAT)
        @NotBlank(message = EMPTY_EMAIL)
        String email,
        @NotBlank(message = EMPTY_REGISTRATION)
        String registration,
        @NotBlank(message = EMPTY_NAME)
        String name,
        String role,
        @NotNull(message = EMPTY_STATUS)
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
