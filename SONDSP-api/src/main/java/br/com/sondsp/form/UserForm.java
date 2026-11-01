package br.com.sondsp.form;

import jakarta.validation.constraints.*;

import static br.com.sondsp.util.SystemMessages.*;

public record UserForm(
	@Pattern(
		regexp = "^[a-z0-9._]+@sme\\.prefeitura\\.gov\\.br$",
		flags = Pattern.Flag.CASE_INSENSITIVE,
		message = INVALID_EMAIL_FORMAT
	)
	@NotBlank(message = EMPTY_EMAIL)
	String email,
	@NotBlank(message = EMPTY_REGISTRATION)
	@Pattern(regexp = "^\\d{1,10}$", message = INVALID_REGISTRATION_FORMAT)
	String registration,
	@NotBlank(message = EMPTY_NAME) String name,
	@NotNull Integer roleId
) {
	public UserForm {
		name = name != null ? name.trim() : null;
		email = email != null ? email.toLowerCase().trim() : null;
	}
}
