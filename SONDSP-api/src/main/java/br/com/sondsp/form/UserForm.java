package br.com.sondsp.form;

public record UserForm(
        String email,
        String username,
        String registration,
        String name,
        String role,
        Boolean status) {
}
