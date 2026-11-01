package br.com.sondsp.dtos;

import br.com.sondsp.entities.SchoolClass;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SchoolClassDTO(
        Integer id,
        String name,
        String gradeLevel,
        String schoolYear,
        String shift,
        Integer numStudents,
        Boolean status
) {
    public SchoolClassDTO(SchoolClass schoolClass) {
        this(
                schoolClass.getId(),
                schoolClass.getName(),
                schoolClass.getGradeLevel(),
                schoolClass.getSchoolYear(),
                schoolClass.getShift(),
                schoolClass.getNumStudents(),
                schoolClass.getStatus()
        );
    }
}
