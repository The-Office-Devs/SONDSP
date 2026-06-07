package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import static br.com.sondsp.util.SystemMessages.EMPTY_NAME;

public record SchoolForm(
        @NotBlank(message = EMPTY_NAME)
        String name) {
}
