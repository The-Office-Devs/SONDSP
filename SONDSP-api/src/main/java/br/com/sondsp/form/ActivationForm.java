package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import static br.com.sondsp.util.SystemMessages.*;

public record ActivationForm(
        @Pattern(regexp = "^\\d{1,10}$", message = INVALID_REGISTRATION_FORMAT)
        @NotBlank(message = EMPTY_REGISTRATION)
        String registration,
        @Pattern(regexp = "^[A-Z]+@sme.prefeitura.gov.br", message = INVALID_EMAIL_FORMAT)
        @NotBlank(message = EMPTY_EMAIL)
        String email,
        @NotBlank(message = EMPTY_PASSWORD)
        String password
) {
}
