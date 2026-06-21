package br.com.sondsp.dtos;

import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.User;

import java.util.List;

public record UserDTO(
        Integer id,
        String name,
        String registration,
        String email,
        String role,
        List<String> permissions,
        Boolean status,
        List<String> schools,
        List<String> schoolClasses) {
    public UserDTO(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getRegistration(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getName() : null,
                user.getPermissions() != null ?
                        user.getPermissions().stream().map(Permission::getPermission).toList() : List.of(),
                user.getStatus(),
                user.getSchools() != null ?
                        user.getSchools().stream().map(s -> s.getSchool().getName()).toList() : List.of(),
                user.getSchoolClasses() != null ?
                        user.getSchoolClasses().stream().map(sc -> sc.getSchoolClass().getName()).toList() : List.of()
        );
    }
}
