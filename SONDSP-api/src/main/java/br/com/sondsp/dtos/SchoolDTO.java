package br.com.sondsp.dtos;

import br.com.sondsp.entities.School;

public record SchoolDTO(
        Integer id,
        String name) {
    public SchoolDTO(School schoool) {
        this(
                schoool.getId(),
                schoool.getName()
        );
    }
}
