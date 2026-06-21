package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import static br.com.sondsp.util.SystemMessages.EMPTY_FUNCTION;
import static br.com.sondsp.util.SystemMessages.EMPTY_SCHOOL_CLASS;

public record LinkSchoolClassForm(
        @NotNull(message = EMPTY_SCHOOL_CLASS)
        Integer schoolClassId,
        @NotBlank(message = EMPTY_FUNCTION)
        String function
) {
}
