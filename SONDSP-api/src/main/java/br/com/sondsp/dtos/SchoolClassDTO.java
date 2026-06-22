package br.com.sondsp.dtos;

import br.com.sondsp.entities.SchoolClass;

public record SchoolClassDTO(
        Integer id,
        SchoolDTO school,
        String name,
        String schoolYear,
        Boolean status
) {
    public SchoolClassDTO(SchoolClass schoolClass) {
        this(
                schoolClass.getId(),
                new SchoolDTO(schoolClass.getSchool()),
                schoolClass.getName(),
                schoolClass.getSchoolYear(),
                schoolClass.getStatus()
        );
    }
}
