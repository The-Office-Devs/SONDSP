package br.com.sondsp.dtos.portfolio;

import br.com.sondsp.entities.StudentAnnotation;
import br.com.sondsp.entities.enums.AnnotationTag;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;

public record StudentAnnotationDTO(
    Integer id,
    Integer studentId,
    Integer authorId,
    AnnotationAuthorDTO author,
    String authorName,
    String authorRole,
    String authorPrefix,
    String date,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    String text,
    Set<AnnotationTag> tags,
    boolean canEdit
) {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public StudentAnnotationDTO(StudentAnnotation annotation, Integer currentUserId) {
        this(
            annotation.getId(),
            annotation.getStudent() != null ? annotation.getStudent().getId() : null,
            annotation.getAuthor() != null ? annotation.getAuthor().getId() : null,
            annotation.getAuthor() != null ? new AnnotationAuthorDTO(annotation.getAuthor()) : null,
            annotation.getAuthor() != null ? annotation.getAuthor().getName() : "Usuário",
            annotation.getAuthor() != null && annotation.getAuthor().getRole() != null ? annotation.getAuthor().getRole().getName() : "Professor",
            annotation.getAuthor() != null && annotation.getAuthor().getRole() != null && "COORDINATOR".equalsIgnoreCase(annotation.getAuthor().getRole().getName()) ? "CP" : "Prof",
            annotation.getCreatedAt() != null ? annotation.getCreatedAt().format(DATE_FORMATTER) : "",
            annotation.getCreatedAt(),
            annotation.getUpdatedAt(),
            annotation.getText(),
            annotation.getTags(),
            annotation.getAuthor() != null && currentUserId != null && annotation.getAuthor().getId().equals(currentUserId)
        );
    }
}
