package br.com.sondsp.dtos;

import br.com.sondsp.entities.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record UserDTO(
        Integer id,
        String name,
        String registration,
        String email,
        String role,
        List<String> permissions,
        Boolean status,
        List<SchoolClassesDTO> schools
) {

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
                user.getSchools() != null && user.getSchoolClasses() != null
                        ? buildSchoolClassesDTO(user.getSchoolClasses(), user.getSchools())
                        : null
        );
    }

    private static List<SchoolClassesDTO> buildSchoolClassesDTO(Set<UserSchoolClass> schoolClasses, Set<UserSchool> schools) {
        if (schools == null || schools.isEmpty()) {
            return null;
        }

        return schools.stream()
                .map(UserSchool::getSchool)
                .filter(school -> Boolean.TRUE.equals(school.getStatus()))
                .map(school -> {
                    List<SchoolClassDTO> classesLinkedToThisSchool = schoolClasses == null ? List.of() :
                            schoolClasses.stream()
                                    .map(UserSchoolClass::getSchoolClass)
                                    .filter(schoolClass -> schoolClass.getSchool() != null &&
                                            schoolClass.getSchool().getId().equals(school.getId()))
                                    .map(schoolClass -> new SchoolClassDTO(schoolClass, false))
                                    .toList();

                    return new SchoolClassesDTO(school, classesLinkedToThisSchool);
                })
                .filter(dto -> !dto.schoolClass().isEmpty())
                .toList();
    }
}