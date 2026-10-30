package br.com.sondsp.services;

import br.com.sondsp.entities.*;
import br.com.sondsp.exceptions.UserAlreadyExistsException;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.*;
import br.com.sondsp.repositories.UsersRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.*;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

import static br.com.sondsp.util.SystemMessages.*;

@Service
@AllArgsConstructor
public class UsersService {

	private final UsersRepository repository;
	private final RolesService rolesService;

	private final SchoolClassService schoolClassService;
	private final SchoolService schoolService;
	private final AccountActivationService accountActivationService;

	public User registerUser(UserForm form) {
		User verifyUser = repository.findByEmailOrRegistration(form.email(), form.registration());

		if (verifyUser != null) {
			if (Objects.equals(verifyUser.getEmail(), form.email())) throw new UserAlreadyExistsException(
				EMAIL_ALREADY_EXISTS
			);

			if (Objects.equals(verifyUser.getRegistration(), form.registration())) throw new UserAlreadyExistsException(
				REGISTRATION_ALREADY_EXISTS
			);
		}

		Set<Role> roles = new HashSet<>();
		if (form.roles() != null && !form.roles().isEmpty()) {
			roles.addAll(rolesService.getRolesByNames(form.roles()));
		} else if (form.role() != null && !form.role().isBlank()) {
			roles.add(rolesService.getRoleByName(form.role()));
		}

		if (roles.isEmpty()) {
			throw new ValidationException(EMPTY_ROLES);
		}

		User savedUser = save(
			User
				.builder()
				.name(form.name())
				.registration(form.registration())
				.roles(roles)
				.status(false)
				.email(form.email())
				.password(null)
				.build()
		);

		try {
			accountActivationService.generateAndSendCode(savedUser, null);
		} catch (Exception ignored) {}

		return savedUser;
	}

	public User getUser(Integer id) {
		return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
	}

	public User getByEmail(String email) {
		User user = repository.findByEmail(email);

		if (user == null) throw new EntityNotFoundException(EMAIL_NOT_FOUND);

		return user;
	}

	public Page<User> getUsers(UserFilter filter, Pageable pageable) {
		Specification<User> spec = buildFilter(filter);
		return repository.findAll(spec, pageable);
	}

	public User save(User user) {
		return repository.save(user);
	}

	public User updateUser(Integer id, UserForm form) {
		User user = getUser(id);

		validadeUser(form, user);

		user.setName(form.name());
		user.setRegistration(form.registration());
		user.setEmail(form.email());

		Set<Role> roles = new HashSet<>();
		if (form.roles() != null && !form.roles().isEmpty()) {
			roles.addAll(rolesService.getRolesByNames(form.roles()));
		} else if (form.role() != null && !form.role().isBlank()) {
			roles.add(rolesService.getRoleByName(form.role()));
		}

		if (!roles.isEmpty()) {
			user.setRoles(roles);
		}

		return save(user);
	}

	public Boolean linkToSchoolClass(Integer id, LinkSchoolClassForm form) {
		// Busca o usuário e a turma
		User user = getUser(id);
		SchoolClass schoolClass = schoolClassService.getSchoolClass(form.schoolClassId());

		// Se encontrar a turma, remove ela
		if (user.getSchoolClasses().removeIf(usc -> usc.getSchoolClass().getId().equals(form.schoolClassId()))) {
			save(user);
			return false;
		}

		// Se não tiver removido, adiciona a turma e retorna true
		UserSchoolClass newSchoolClass = UserSchoolClass
			.builder()
			.user(user)
			.schoolClass(schoolClass)
			.atuacao(form.function())
			.build();
		user.getSchoolClasses().add(newSchoolClass);

		save(user);
		return true;
	}

	public Boolean linkToSchool(Integer id, LinkSchoolForm form) {
		// Busca o usuário e a escola
		User user = getUser(id);
		School school = schoolService.getSchool(form.schoolId());

		// Se o usuário possui vínculo com a escola
		if (user.getSchools().stream().anyMatch(usc -> usc.getSchool().getId().equals(school.getId()))) {
			// Remove o vínculo do usuario com todas as turmas da escola
			user.getSchoolClasses().removeIf(sc -> sc.getSchoolClass().getSchool().getId().equals(school.getId()));

			// Remove o vínculo com a escola
			user.getSchools().removeIf(usc -> usc.getSchool().getId().equals(school.getId()));

			save(user);
			return false;
		}

		// Se não possui vínculo com a escola, deve criá-lo
		if (form.function() == null || form.function().isBlank()) {
			// Caso esteja criando um vínculo, deve ser passada a função do usuário na
			// escola
			throw new ValidationException(EMPTY_FUNCTION);
		}

		UserSchool newSchool = UserSchool.builder().user(user).school(school).atuacao(form.function()).build();
		user.getSchools().add(newSchool);

		save(user);
		return true;
	}

	public Boolean changeStatus(Integer id) {
		User user = getUser(id);

		if (user.getPassword() == null) throw new ValidationException(FIRST_ACCESS_NOT_DONE);

		user.setStatus(!user.getStatus());

		return save(user).getStatus();
	}

	public User changePassword(ChangePasswordForm form) {
		User user = getByEmail(form.email());

		if (user.getStatus()) {
			user.setPassword(encodePassword(form.password()));

			return save(user);
		} else {
			throw new ValidationException(INACTIVATED_USER);
		}
	}

	public User findByEmailAndRegistration(String email, String registration) {
		return repository.findByEmailAndRegistration(email, registration);
	}

	private Specification<User> buildFilter(UserFilter filter) {
		return (root, query, criteriaBuilder) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (filter == null) return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

			if (filter.search() != null && !filter.search().isBlank()) {
				query.distinct(true);
				Join<User, Role> roleJoin = root.join("roles", JoinType.LEFT);

				String search = filter.search().toLowerCase();
				String searchPattern = "%" + search + "%";

				List<Predicate> orPredicates = new ArrayList<>();
				orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern));
				orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern));
				orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("registration")), searchPattern));
				orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(roleJoin.get("name")), searchPattern));

				Boolean status = null;
				if ("ativo".startsWith(search)) {
					status = true;
				} else if ("inativo".startsWith(search)) {
					status = false;
				}

				if (status != null) orPredicates.add(criteriaBuilder.equal(root.get("status"), status));

				predicates.add(criteriaBuilder.or(orPredicates.toArray(new Predicate[0])));
			} else {
				if (filter.name() != null && !filter.name().isBlank()) predicates.add(
					criteriaBuilder.like(
						criteriaBuilder.lower(root.get("name")),
						"%" + filter.name().toLowerCase() + "%"
					)
				);

				if (filter.registration() != null && !filter.registration().isBlank()) predicates.add(
					criteriaBuilder.equal(
						criteriaBuilder.lower(root.get("registration")),
						filter.registration().toLowerCase()
					)
				);

				if (filter.roleName() != null && !filter.roleName().isBlank()) {
					query.distinct(true);
					Join<User, Role> roleJoin = root.join("roles", JoinType.INNER);

					predicates.add(
						criteriaBuilder.like(
							criteriaBuilder.lower(roleJoin.get("name")),
							"%" + filter.roleName().toLowerCase() + "%"
						)
					);
				}

				if (filter.email() != null && !filter.email().isBlank()) predicates.add(
					criteriaBuilder.like(
						criteriaBuilder.lower(root.get("email")),
						"%" + filter.email().toLowerCase() + "%"
					)
				);
			}

			if (filter.linkedToSchoolId() != null) {
				Subquery<Integer> sub = query.subquery(Integer.class);
				Root<UserSchool> usRoot = sub.from(UserSchool.class);
				sub
					.select(usRoot.get("user").get("id"))
					.where(criteriaBuilder.equal(usRoot.get("school").get("id"), filter.linkedToSchoolId()));
				predicates.add(root.get("id").in(sub));
			}

			if (filter.status() != null) predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));

			return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
		};
	}

	public boolean isLinked(User user, Integer schoolId, Integer schoolClassId) {
		if (schoolClassId != null) return (
			user.getSchoolClasses() != null &&
			user
				.getSchoolClasses()
				.stream()
				.anyMatch(usc -> usc.getSchoolClass() != null && schoolClassId.equals(usc.getSchoolClass().getId()))
		);

		if (schoolId != null) return (
			user.getSchools() != null &&
			user.getSchools().stream().anyMatch(us -> us.getSchool() != null && schoolId.equals(us.getSchool().getId()))
		);

		return false;
	}

	private void validadeUser(UserForm userForm, User user) {
		if (
			!Objects.equals(user.getEmail(), userForm.email()) && repository.existsByEmail(userForm.email())
		) throw new ValidationException(EMAIL_ALREADY_EXISTS);

		if (
			!Objects.equals(user.getRegistration(), userForm.registration()) &&
			repository.existsByRegistration(userForm.registration())
		) throw new ValidationException(REGISTRATION_ALREADY_EXISTS);
	}

	public String encodePassword(String password) {
		return new BCryptPasswordEncoder().encode(password);
	}
}
