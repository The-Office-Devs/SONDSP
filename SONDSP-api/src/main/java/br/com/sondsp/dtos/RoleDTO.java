package br.com.sondsp.dtos;

import br.com.sondsp.entities.Role;

import java.util.Comparator;
import java.util.List;

public record RoleDTO(
        Integer id,
        String name,
        List<PermissionDTO> permissions,
        boolean isAdmin,
        int userCount
) {
    public RoleDTO(Role role) {
        this(
                role.getId(),
                role.getName(),
                role.getPermissions() != null
                        ? role.getPermissions().stream()
                                .map(PermissionDTO::new)
                                .sorted(Comparator.comparing(PermissionDTO::area).thenComparing(PermissionDTO::description))
                                .toList()
                        : List.of(),
                role.isAdmin(),
                role.getUsers() != null ? role.getUsers().size() : 0
        );
    }
}
