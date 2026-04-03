package br.com.sondsp.dtos;

public record RegisterDTO(
        String name,
        String username,
        String cpf,
        String registration,
        String role,
        String email,
        String password,
        Boolean status) {
}
