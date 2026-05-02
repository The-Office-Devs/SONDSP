package br.com.sondsp.dtos;

import java.util.List;

public record UserSelfDetailsDTO(
        String name,
        String registration,
        String role,
        String token,
        List<String> permissions) {
}
