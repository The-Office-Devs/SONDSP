package br.com.sondsp.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

import static br.com.sondsp.util.SystemMessages.*;

public record ChangePasswordForm(
        @Email(message = INVALID_EMAIL_FORMAT)
        @NotEmpty(message = EMPTY_EMAIL)
        String email,
        @NotEmpty(message = EMPTY_PASSWORD)
        String password
) {
}
