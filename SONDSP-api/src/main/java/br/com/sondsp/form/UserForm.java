package br.com.sondsp.form;

import java.util.List;

public record UserForm(
        String email,
        String registration,
        String name,
        String role,
        Boolean status,
        List<String> permissions) {
}
