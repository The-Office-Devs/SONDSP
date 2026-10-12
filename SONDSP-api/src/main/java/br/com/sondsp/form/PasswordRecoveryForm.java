package br.com.sondsp.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PasswordRecoveryForm(
        @NotBlank @Email String email
) {
}
