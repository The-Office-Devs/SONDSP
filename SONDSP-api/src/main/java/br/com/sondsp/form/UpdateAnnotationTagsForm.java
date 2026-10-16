package br.com.sondsp.form;

import br.com.sondsp.entities.enums.AnnotationTag;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record UpdateAnnotationTagsForm(
    @NotNull(message = "O conjunto de tags não pode ser nulo")
    Set<AnnotationTag> tags
) {}
