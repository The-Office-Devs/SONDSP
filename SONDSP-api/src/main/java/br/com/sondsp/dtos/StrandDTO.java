package br.com.sondsp.dtos;

import br.com.sondsp.entities.Strand;

public record StrandDTO(
        Integer id,
        String name,
        String subject,
        Boolean status
) {
    public StrandDTO(Strand strand) {
        this(
                strand.getId(),
                strand.getName(),
                strand.getSubject(),
                strand.getStatus()
        );
    }
}
