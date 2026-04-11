package br.com.sondsp.dtos;

public record UserSelfDetailsDTO(
        String name,
        String registration,
        String role,
        String token) {
}
