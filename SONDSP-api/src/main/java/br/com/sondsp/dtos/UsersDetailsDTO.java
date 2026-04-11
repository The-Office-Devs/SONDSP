package br.com.sondsp.dtos;

public record UsersDetailsDTO(
        Integer idUser,
        String username,
        String name,
        String registration,
        String email) {
}
