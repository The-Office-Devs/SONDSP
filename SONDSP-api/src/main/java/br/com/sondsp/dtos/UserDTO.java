package br.com.sondsp.dtos;

import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.School;
import br.com.sondsp.entities.SchoolClass;
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
                user.getSchools().stream().map(School::getName).toList(),
                user.getSchoolClasses().stream().map(SchoolClass::getName).toList()
        );
    }
}
