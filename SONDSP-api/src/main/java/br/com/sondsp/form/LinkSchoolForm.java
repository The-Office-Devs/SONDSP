package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import static br.com.sondsp.util.SystemMessages.EMPTY_FUNCTION;
import static br.com.sondsp.util.SystemMessages.EMPTY_SCHOOL;

public record LinkSchoolForm(
        @NotNull(message = EMPTY_SCHOOL)
        Integer schoolId,
        @NotBlank(message = EMPTY_FUNCTION)
        String function
) {
}
