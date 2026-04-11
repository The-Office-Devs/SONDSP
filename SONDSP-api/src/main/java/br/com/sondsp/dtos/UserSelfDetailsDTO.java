package br.com.sondsp.dtos;

public record UserSelfDetailsDTO(
        String name,
        String username,
        String registration,
        String role,
        String token) {
}
