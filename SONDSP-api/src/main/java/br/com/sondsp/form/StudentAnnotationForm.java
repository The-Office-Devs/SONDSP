package br.com.sondsp.form;

import br.com.sondsp.entities.enums.AnnotationTag;
import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record StudentAnnotationForm(
    @NotBlank(message = "O texto da anotação não pode estar vazio")
    String text,
    Set<AnnotationTag> tags
) {}
