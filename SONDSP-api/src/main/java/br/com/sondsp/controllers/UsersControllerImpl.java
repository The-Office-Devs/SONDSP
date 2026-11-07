package br.com.sondsp.controllers;

import br.com.sondsp.dtos.*;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.LinkSchoolClassForm;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

@RestController
@RequestMapping("/user")
public class UsersControllerImpl implements UsersController {

	@Autowired
	private UsersService service;

	@PostMapping
	@PreAuthorize("hasAuthority('USER_MANAGE')")
	public ResponseEntity<?> register(UserForm form) {
		return ResponseEntity.ok().body(new RegisterDTO(service.registerUser(form)));
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('USER_VIEW')")
	public ResponseEntity<?> getUserById(Integer id) {
		return ResponseEntity.ok().body(new UserDTO(service.getUser(id)));
	}

	@GetMapping
	@PreAuthorize("hasAuthority('USER_VIEW')")
	public ResponseEntity<PageResponse<UsersListDTO>> listUser(UserFilter filter, Pageable pageable) {
		Page<User> userPage = service.getUsers(filter, pageable);

		Integer schoolClassId = filter != null ? filter.schoolClassId() : null;

		List<UsersListDTO> contentDTO = userPage
			.getContent()
			.stream()
			.map(user -> new UsersListDTO(user, service.isLinked(user, schoolClassId)))
			.toList();

		PageResponse<UsersListDTO> response = new PageResponse<>(
			contentDTO,
			userPage.getNumber(),
			userPage.getSize(),
			userPage.getTotalElements(),
			userPage.getTotalPages(),
			userPage.hasNext(),
			userPage.hasPrevious()
		);

		return ResponseEntity.ok().body(response);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('USER_MANAGE')")
	public ResponseEntity<?> updateUser(Integer id, UserForm user) {
		return ResponseEntity.ok().body(new UserDTO(service.updateUser(id, user)));
	}

	@PatchMapping("/{id}/linkSchoolClass")
	@PreAuthorize("hasAuthority('USUARIO_VINCULAR_TURMA')")
	public ResponseEntity<?> linkToSchoolClass(Integer id, LinkSchoolClassForm form) {
		if (service.linkToSchoolClass(id, form)) return ResponseEntity.ok().body(USER_LINKED_TO_SCHOOL_CLASS);

		return ResponseEntity.ok().body(USER_UNLINKED_TO_SCHOOL_CLASS);
	}

	@PatchMapping("/{id}/changeStatus")
	@PreAuthorize("hasAuthority('USUARIO_STATUS')")
	public ResponseEntity<?> changeStatus(Integer id) {
		if (service.changeStatus(id)) return ResponseEntity.ok(USER_ACTIVATED);

		return ResponseEntity.ok(USER_DEACTIVATED);
	}
}
