package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import static br.com.sondsp.util.SystemMessages.*;

public record ActivityForm(
        @NotBlank(message = EMPTY_NAME)
        String name,
        @NotBlank(message = EMPTY_SUBJECT)
        String subject,
        @NotBlank(message = EMPTY_AXIS)
        String axis,
        @NotBlank(message = EMPTY_MODEL)
        String model,
        @NotNull(message = EMPTY_STATUS)
        Boolean status
) {
}
