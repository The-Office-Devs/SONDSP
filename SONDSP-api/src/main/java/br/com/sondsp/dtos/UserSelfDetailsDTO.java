package br.com.sondsp.dtos;

import br.com.sondsp.entities.Permission;
import br.com.sondsp.security.UserAuthResult;

import java.util.List;

public record UserSelfDetailsDTO(
        String name,
        String registration,
        String role,
        String token,
        List<String> permissions) {
    public UserSelfDetailsDTO(UserAuthResult userAuth) {
        this(
                userAuth.user().getName(),
                userAuth.user().getRegistration(),
                userAuth.user().getRole() != null ? userAuth.user().getRole().getName() : null,
                userAuth.token(),
                userAuth.user().getPermissions() != null ?
                        userAuth.user().getPermissions().stream().map(Permission::getPermission).toList() : List.of()
        );
    }
}
