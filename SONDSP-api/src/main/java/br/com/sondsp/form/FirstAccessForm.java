package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import static br.com.sondsp.util.SystemMessages.*;

public record FirstAccessForm(
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
        @NotBlank(message = EMPTY_PASSWORD)
        String password
) {
        public FirstAccessForm {
                email = email.toLowerCase();
        }
}
