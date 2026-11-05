package br.com.sondsp.dtos;

import java.util.Set;

public record GroupedPermissionsDTO(String area, Set<PermissionDTO> permissions) {}
