package br.com.sondsp.dtos;

import br.com.sondsp.entities.User;

public record RegisterDTO(String name, String registration, String role, String email) {
	public RegisterDTO(User user) {
		this(
			user.getName(),
			user.getRegistration(),
			user.getRole() != null ? user.getRole().getName() : null,
			user.getEmail()
		);
	}
}
