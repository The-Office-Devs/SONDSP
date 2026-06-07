package br.com.sondsp.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import static br.com.sondsp.util.SystemMessages.*;

public record ChangePasswordForm(
        @Email(message = INVALID_EMAIL_FORMAT)
        @NotBlank(message = EMPTY_EMAIL)
        String email,
        @NotBlank(message = EMPTY_PASSWORD)
        String password
) {
}
