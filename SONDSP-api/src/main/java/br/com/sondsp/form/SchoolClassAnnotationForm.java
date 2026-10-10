package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;

import static br.com.sondsp.util.SystemMessages.EMPTY_TEXT;

public record SchoolClassAnnotationForm(
        @NotBlank(message = EMPTY_TEXT)
        String text
) {
}
