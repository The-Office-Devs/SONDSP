package br.com.sondsp.dtos;

import br.com.sondsp.entities.*;
import java.util.List;
import java.util.Set;

public record UserDTO(
	Integer id,
	String name,
	String registration,
	String email,
	String role,
	Boolean status,
	List<SchoolClassDTO> schoolClasses
) {
	public UserDTO(User user) {
		this(
			user.getId(),
			user.getName(),
			user.getRegistration(),
			user.getEmail(),
			user.getRole() != null ? user.getRole().getName() : null,
			user.getStatus(),
			user.getSchoolClasses() != null ? buildSchoolClassDTO(user.getSchoolClasses()) : null
		);
	}

	private static List<SchoolClassDTO> buildSchoolClassDTO(Set<UserSchoolClass> schoolClasses) {
		return schoolClasses
			.stream()
			.map(userSchoolClass -> {
				SchoolClass schoolClass = userSchoolClass.getSchoolClass();

				return new SchoolClassDTO(schoolClass);
			})
			.toList();
	}
}
