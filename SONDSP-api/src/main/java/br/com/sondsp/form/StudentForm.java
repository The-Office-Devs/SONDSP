package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import static br.com.sondsp.util.SystemMessages.*;

public record StudentForm(
        @NotBlank(message = EMPTY_NAME)
        String name,
        @NotBlank(message = EMPTY_REGISTRATION)
        String registration,
        Integer schoolClassId,
        Integer rowNumber,
        @NotNull(message = EMPTY_STATUS)
        Boolean status
) {
}
