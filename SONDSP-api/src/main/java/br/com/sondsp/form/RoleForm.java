package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record RoleForm(
        @NotBlank(message = "O nome da função é obrigatório.")
        String name,
        List<Integer> permissionIds
) {
    public RoleForm {
        name = name != null ? name.trim() : null;
        permissionIds = permissionIds != null ? permissionIds : List.of();
    }
}
