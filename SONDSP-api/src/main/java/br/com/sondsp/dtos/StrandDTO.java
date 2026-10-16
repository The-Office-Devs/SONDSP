package br.com.sondsp.dtos;

import br.com.sondsp.entities.Strand;

public record StrandDTO(
        Integer id,
        String name,
        String subject,
        String code,
        Boolean status
) {
    public StrandDTO(Integer id, String name, String subject, Boolean status) {
        this(id, name, subject, null, status);
    }

    public StrandDTO(Strand strand) {
        this(
                strand.getId(),
                strand.getName(),
                strand.getSubject(),
                strand.getCode(),
                strand.getStatus()
        );
    }
}
