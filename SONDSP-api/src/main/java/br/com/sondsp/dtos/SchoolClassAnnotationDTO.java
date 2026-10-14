package br.com.sondsp.dtos;

import br.com.sondsp.entities.SchoolClassAnnotation;

import java.time.LocalDateTime;

public record SchoolClassAnnotationDTO(
        Integer id,
        SchoolClassDTO schoolClass,
        UserDTO author,
        String text,
        LocalDateTime creationDate
) {
    public SchoolClassAnnotationDTO(SchoolClassAnnotation schoolClassAnnotation) {
        this(
                schoolClassAnnotation.getId().getId(),
                new SchoolClassDTO(schoolClassAnnotation.getSchoolClass()),
                new UserDTO(schoolClassAnnotation.getAuthor()),
                schoolClassAnnotation.getAnnotationText(),
                schoolClassAnnotation.getCreationDate()
        );
    }
}
