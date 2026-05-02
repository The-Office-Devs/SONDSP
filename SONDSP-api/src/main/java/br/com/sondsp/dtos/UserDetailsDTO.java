package br.com.sondsp.dtos;

import java.util.List;

public record UserDetailsDTO(
        Integer idUser,
        String name,
        String registration,
        String email,
        String role,
        List<String> permissions) {
}
