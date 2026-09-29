package br.com.sondsp.dtos;

import br.com.sondsp.entities.School;

public record SchoolDTO(
        Integer id,
        String name,
        String codigoInep,
        Boolean status
) {
    public SchoolDTO(School school) {
        this(
                school.getId(),
                school.getName(),
                school.getCodigoInep(),
                school.getStatus()
        );
    }
}
