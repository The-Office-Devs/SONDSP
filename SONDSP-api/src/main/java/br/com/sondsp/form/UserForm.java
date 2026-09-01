package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

public record UserForm(
        @Pattern(
                regexp = "^[a-z0-9._]+@sme\\.prefeitura\\.gov\\.br$",
                flags = Pattern.Flag.CASE_INSENSITIVE,
                message = INVALID_EMAIL_FORMAT
        )
        @NotBlank(message = EMPTY_EMAIL)
        String email,
        @NotBlank(message = EMPTY_REGISTRATION)
        @Pattern(regexp = "^\\d{1,10}$", message = INVALID_REGISTRATION_FORMAT)
        String registration,
        @NotBlank(message = EMPTY_NAME)
        String name,
        @NotBlank(message = EMPTY_ROLE)
        String role,
        @NotEmpty(message = EMPTY_PERMISSIONS)
        List<@NotBlank(message = EMPTY_PERMISSION)String> permissions
) {
    public UserForm {
        name = name.trim();
        role = role.trim();

        permissions = permissions.stream()
                        .map(p -> p != null ? p.trim() : null)
                        .toList();

        email = email.toLowerCase();
    }
}
