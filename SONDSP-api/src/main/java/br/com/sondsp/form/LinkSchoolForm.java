package br.com.sondsp.form;

import jakarta.validation.constraints.NotNull;

import static br.com.sondsp.util.SystemMessages.EMPTY_SCHOOL;

public record LinkSchoolForm(
        @NotNull(message = EMPTY_SCHOOL)
        Integer schoolId,
        String function
) {
}
