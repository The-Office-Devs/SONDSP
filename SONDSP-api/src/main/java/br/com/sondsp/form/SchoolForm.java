package br.com.sondsp.form;

import jakarta.validation.constraints.NotEmpty;

import static br.com.sondsp.util.SystemMessages.EMPTY_NAME;

public record SchoolForm(
        @NotEmpty(message = EMPTY_NAME)
        String name) {
}
