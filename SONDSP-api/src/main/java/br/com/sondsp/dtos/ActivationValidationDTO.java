package br.com.sondsp.dtos;

public record ActivationValidationDTO(
        String temporaryToken,
        String email,
        String name
) {
}
