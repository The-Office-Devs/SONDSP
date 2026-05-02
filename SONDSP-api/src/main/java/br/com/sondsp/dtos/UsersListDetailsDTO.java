package br.com.sondsp.dtos;

public record UsersListDetailsDTO(
        Integer idUser,
        String name,
        String registration,
        String email) {
}
