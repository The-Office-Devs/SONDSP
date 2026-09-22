package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import static br.com.sondsp.util.SystemMessages.*;

public record SchoolForm(
        @NotBlank(message = EMPTY_NAME)
        String name,
        
        @NotBlank(message = EMPTY_INEP)
        @Pattern(regexp = "^\\d{8}$", message = INVALID_INEP_FORMAT)
        String codigoInep
) {
}
