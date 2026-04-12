package br.com.sondsp.dtos;

import java.util.List;

public record RegisterDTO(
        String name,
        String registration,
        String role,
        String email,
        String password,
        List<String> permissions) {
}
