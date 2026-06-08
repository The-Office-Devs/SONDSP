package br.com.sondsp.form.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.Year;

public class SchoolYearValidator implements ConstraintValidator<ValidSchoolYear, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }

        try {
            Integer inputYear = Integer.parseInt(value);
            Integer currentYear = Year.now().getValue();

            return inputYear <= currentYear && inputYear >= 2000;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
