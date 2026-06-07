package br.com.sondsp.dtos;

public record UsersDetailsDTO(
        Integer idUser,
        String name,
        String registration,
        String email) {
}
