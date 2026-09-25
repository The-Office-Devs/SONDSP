package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;

public record PasswordResetForm(
        @NotBlank String token,
        @NotBlank String newPassword,
        @NotBlank String confirmPassword
) {
}
