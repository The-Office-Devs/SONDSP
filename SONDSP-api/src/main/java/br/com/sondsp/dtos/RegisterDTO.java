package br.com.sondsp.dtos;

public record RegisterDTO(
        String name,
        String registration,
        String role,
        String email,
        String password) {
}
