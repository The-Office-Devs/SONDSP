package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import static br.com.sondsp.util.SystemMessages.*;

public record SchoolForm(
        @NotBlank(message = EMPTY_NAME)
        String name,
        @NotBlank(message = EMPTY_PRINCIPAL)
        String principalName,
        @NotNull(message = EMPTY_STATUS)
        Boolean status
) {
}
