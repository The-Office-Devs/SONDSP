package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.ArrayList;
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
        String role,
        List<String> roles,
        List<String> permissions
) {
    public UserForm {
        name = name != null ? name.trim() : null;
        role = role != null && !role.isBlank() ? role.trim() : null;
        email = email != null ? email.toLowerCase().trim() : null;

        List<String> normalizedRoles = new ArrayList<>();
        if (roles != null) {
            for (String r : roles) {
                if (r != null && !r.isBlank()) {
                    normalizedRoles.add(r.trim());
                }
            }
        }
        if (normalizedRoles.isEmpty() && role != null) {
            normalizedRoles.add(role);
        }
        if (role == null && !normalizedRoles.isEmpty()) {
            role = normalizedRoles.get(0);
        }
        roles = List.copyOf(normalizedRoles);

        List<String> normalizedPermissions = new ArrayList<>();
        if (permissions != null) {
            for (String p : permissions) {
                if (p != null && !p.isBlank()) {
                    normalizedPermissions.add(p.trim());
                }
            }
        }
        permissions = List.copyOf(normalizedPermissions);
    }
}
