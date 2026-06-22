package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

public record UserForm(
        @Pattern(regexp = "^[a-zA-Z0-9._]+@sme\\.prefeitura\\.gov\\.br$", message = INVALID_EMAIL_FORMAT)
        @NotBlank(message = EMPTY_EMAIL)
        String email,
        @NotBlank(message = EMPTY_REGISTRATION)
        @Pattern(regexp = "^\\d{1,10}$", message = INVALID_REGISTRATION_FORMAT)
        String registration,
        @NotBlank(message = EMPTY_NAME)
        String name,
        String role,
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
