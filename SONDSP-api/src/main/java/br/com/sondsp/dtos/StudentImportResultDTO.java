package br.com.sondsp.dtos;

public record StudentImportResultDTO(
        String className, boolean classCreated,
        int created, int updated, int unlinked, int ignored
) {}