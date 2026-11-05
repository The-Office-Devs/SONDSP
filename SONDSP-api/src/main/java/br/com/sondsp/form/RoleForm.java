package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

import static br.com.sondsp.util.SystemMessages.EMPTY_NAME;

public record RoleForm(@NotBlank(message = EMPTY_NAME) String name, Set<Integer> permissionIds) {
	public RoleForm {
		name = name != null ? name.trim() : null;
		permissionIds = permissionIds != null ? permissionIds : Set.of();
	}
}
