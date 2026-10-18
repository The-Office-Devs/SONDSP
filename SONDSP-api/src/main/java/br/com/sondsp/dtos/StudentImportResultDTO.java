package br.com.sondsp.dtos;

public record StudentImportResultDTO(
        String schoolName, String className, boolean classCreated,
        int created, int updated, int unlinked, int ignored
) {}