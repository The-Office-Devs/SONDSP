package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import static br.com.sondsp.util.SystemMessages.*;

public record ChangePasswordForm(
        @Pattern(
                regexp = "^[a-z0-9._]+@sme\\.prefeitura\\.gov\\.br$",
                flags = Pattern.Flag.CASE_INSENSITIVE,
                message = INVALID_EMAIL_FORMAT
        )
        @NotBlank(message = EMPTY_EMAIL)
        String email,
        @NotBlank(message = EMPTY_PASSWORD)
        String password
) {
        public ChangePasswordForm {
                email = email.toLowerCase();
        }
}
