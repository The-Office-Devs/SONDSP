package br.com.sondsp.dtos;

import br.com.sondsp.entities.School;

import java.util.List;

public record SchoolClassesDTO(
        Integer id,
        String name,
        String codigoInep,
        List<SchoolClassDTO> schoolClass
) {
    public SchoolClassesDTO(School school, List<SchoolClassDTO> schoolClass) {
        this (
                school.getId(),
                school.getName(),
                school.getCodigoInep(),
                schoolClass
        );
    }
}
