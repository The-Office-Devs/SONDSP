package br.com.sondsp.dtos;

import java.util.List;

public record GroupedPermissionsDTO(
        String area,
        List<PermissionDTO> permissions
) {
}
