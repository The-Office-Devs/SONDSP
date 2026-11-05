package br.com.sondsp.dtos;

import br.com.sondsp.entities.Permission;

public record PermissionDTO(
        Integer id,
        String permission,
        String description,
        String area
) {
    public PermissionDTO(Permission permission) {
        this(
                permission.getId(),
                permission.getPermission(),
                permission.getDescription() != null ? permission.getDescription() : permission.getPermission(),
                permission.getArea() != null ? permission.getArea() : "Geral"
        );
    }
}
