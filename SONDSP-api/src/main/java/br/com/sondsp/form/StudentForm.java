package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import static br.com.sondsp.util.SystemMessages.*;

public record StudentForm(
        @NotBlank(message = EMPTY_NAME)
        String name,
        @Pattern(regexp = "^\\d{1,10}$", message = INVALID_REGISTRATION_FORMAT)
        @NotBlank(message = EMPTY_REGISTRATION)
        String registration,
        Integer schoolClassId,
        Integer rowNumber
) {
}
