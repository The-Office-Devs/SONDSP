package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import static br.com.sondsp.util.SystemMessages.*;

public record ValidateActivationForm(
        @Pattern(
                regexp = "^[a-z0-9._]+@sme\\.prefeitura\\.gov\\.br$",
                flags = Pattern.Flag.CASE_INSENSITIVE,
                message = INVALID_EMAIL_FORMAT
        )
        @NotBlank(message = EMPTY_EMAIL)
        String email,

        @Pattern(regexp = "^\\d{1,10}$", message = INVALID_REGISTRATION_FORMAT)
        @NotBlank(message = EMPTY_REGISTRATION)
        String registration,

        @NotBlank(message = "O código de ativação não pode estar em branco.")
        String code
) {
    public ValidateActivationForm {
        email = email != null ? email.trim().toLowerCase() : null;
        registration = registration != null ? registration.trim() : null;
        code = code != null ? code.trim().toUpperCase() : null;
    }
}
