package br.com.sondsp.filters;

public record UserFilter(
        String name,
        String registration,
        String roleName,
        String email,
        Boolean status,
        String search
) {
}
