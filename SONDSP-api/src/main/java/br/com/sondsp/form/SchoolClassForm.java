package br.com.sondsp.form;

import br.com.sondsp.form.validation.ValidSchoolYear;
import jakarta.validation.constraints.NotBlank;

import static br.com.sondsp.util.SystemMessages.*;

public record SchoolClassForm(
        @NotBlank(message = EMPTY_NAME)
        String name,
        @NotBlank(message = EMPTY_GRADE_LEVEL)
        String gradeLevel,
        @NotBlank(message = EMPTY_YEAR)
        @ValidSchoolYear(message = INVALID_YEAR)
        String schoolYear,
        @NotBlank(message = EMPTY_SHIFT)
        String shift
) {
}
