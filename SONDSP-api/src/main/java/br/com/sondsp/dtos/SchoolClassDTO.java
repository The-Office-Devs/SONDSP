package br.com.sondsp.dtos;

import br.com.sondsp.entities.SchoolClass;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SchoolClassDTO(
        Integer id,
        SchoolDTO school,
        String name,
        String schoolYear,
        Boolean status
) {
    public SchoolClassDTO(SchoolClass schoolClass) {
        this(schoolClass, true);
    }

    public SchoolClassDTO(SchoolClass schoolClass, boolean includeSchool) {
        this(
                schoolClass.getId(),
                includeSchool && schoolClass.getSchool() != null ? new SchoolDTO(schoolClass.getSchool()) : null,
                schoolClass.getName(),
                schoolClass.getSchoolYear(),
                schoolClass.getStatus()
        );
    }
}
