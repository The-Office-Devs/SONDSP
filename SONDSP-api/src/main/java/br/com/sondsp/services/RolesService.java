package br.com.sondsp.services;

import br.com.sondsp.dtos.GroupedPermissionsDTO;
import br.com.sondsp.dtos.PermissionDTO;
import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.Role;
import br.com.sondsp.form.RoleForm;
import br.com.sondsp.repositories.PermissionsRepository;
import br.com.sondsp.repositories.RolesRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static br.com.sondsp.util.SystemMessages.*;

@Service
@AllArgsConstructor
public class RolesService {

	private final RolesRepository repository;
	private final PermissionsRepository permissionsRepository;

	public List<Role> getAllRoles() {
		return repository.findAllByOrderByIdAsc();
	}

	public Role getRoleById(Integer id) {
		return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND));
	}

	public Role getRoleByName(String name) {
		if (name == null || name.isBlank()) {
			throw new EntityNotFoundException(ROLE_NOT_FOUND);
		}
		return repository
			.findByNameIgnoreCase(name.trim())
			.or(() -> repository.getRoleByName(name.trim()))
			.orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND));
	}

	public Set<Role> getRolesByNames(Collection<String> names) {
		if (names == null || names.isEmpty()) {
			return Collections.emptySet();
		}
		Set<Role> roles = new HashSet<>();
		for (String name : names) {
			if (name != null && !name.isBlank()) {
				roles.add(getRoleByName(name));
			}
		}
		return roles;
	}

	@Transactional
	public Role createRole(RoleForm form) {
		if (form.name() == null || form.name().isBlank()) {
			throw new ValidationException(EMPTY_ROLE);
		}

		String normalizedName = form.name().trim();

		if (repository.existsByNameIgnoreCase(normalizedName)) {
			throw new ValidationException(ROLE_ALREADY_EXISTS);
		}

		Set<Permission> permissions = new HashSet<>();
		if (form.permissionIds() != null && !form.permissionIds().isEmpty()) {
			permissions = new HashSet<>(permissionsRepository.findAllByIdIn(form.permissionIds()));
		}

		Role role = Role.builder().name(normalizedName).permissions(permissions).build();

		if (role.isAdmin()) {
			role.setPermissions(new HashSet<>(permissionsRepository.findAll()));
			return repository.save(role);
		}

		role
			.getPermissions()
			.removeIf(p -> {
				String area = p.getArea();
				String perm = p.getPermission();
				return (
					(area != null && area.equalsIgnoreCase("Escolas")) || (perm != null && perm.startsWith("ESCOLA_"))
				);
			});

		ensureViewPermissions(role.getPermissions());

		return repository.save(role);
	}

	@Transactional
	public Role updateRole(Integer id, RoleForm form) {
		Role role = getRoleById(id);

		if (form.name() == null || form.name().isBlank()) {
			throw new ValidationException(EMPTY_ROLE);
		}

		String normalizedName = form.name().trim();

		if (role.isAdmin()) {
			List<Permission> allPermissions = permissionsRepository.findAll();
			role.setPermissions(new HashSet<>(allPermissions));
			return repository.save(role);
		}

		if (repository.existsByNameIgnoreCaseAndIdNot(normalizedName, id)) {
			throw new ValidationException(ROLE_ALREADY_EXISTS);
		}

		role.setName(normalizedName);

		Set<Permission> permissions = new HashSet<>();
		if (form.permissionIds() != null && !form.permissionIds().isEmpty()) {
			Set<Permission> fetched = new HashSet<>(permissionsRepository.findAllByIdIn(form.permissionIds()));
			fetched.removeIf(p -> {
				String area = p.getArea();
				String perm = p.getPermission();
				return (
					(area != null && area.equalsIgnoreCase("Escolas")) || (perm != null && perm.startsWith("ESCOLA_"))
				);
			});
			permissions = fetched;
		}

		ensureViewPermissions(permissions);

		role.setPermissions(permissions);
		return repository.save(role);
	}

	@Transactional
	public void deleteRole(Integer id) {
		Role role = getRoleById(id);

		if (role.isAdmin()) {
			throw new ValidationException(ADMIN_ROLE_CANNOT_BE_DELETED);
		}

		//		if (role.getUsers() != null && !role.getUsers().isEmpty()) {
		//			throw new ValidationException(ROLE_HAS_ASSOCIATED_USERS);
		//		}

		repository.delete(role);
	}

	public List<GroupedPermissionsDTO> getGroupedPermissions() {
		List<Permission> permissions = permissionsRepository.findAllByOrderByAreaAscPermissionAsc();
		Map<String, List<PermissionDTO>> groupedMap = new LinkedHashMap<>();

		for (Permission permission : permissions) {
			String area = permission.getArea() != null && !permission.getArea().isBlank()
				? permission.getArea()
				: "Geral";

			if (
				"Escolas".equalsIgnoreCase(area) ||
				(permission.getPermission() != null && permission.getPermission().startsWith("ESCOLA_"))
			) {
				continue;
			}

			groupedMap.computeIfAbsent(area, k -> new ArrayList<>()).add(new PermissionDTO(permission));
		}

		List<GroupedPermissionsDTO> result = new ArrayList<>();
		groupedMap.forEach((area, list) -> result.add(new GroupedPermissionsDTO(area, list)));
		return result;
	}

	private void ensureViewPermissions(Set<Permission> permissions) {
		if (permissions == null || permissions.isEmpty()) return;

		Map<String, String> areaToViewPermission = Map.of(
			"Alunos",
			"ALUNO_VIEW",
			"Turmas",
			"TURMA_VIEW",
			"Sondagens",
			"SONDAGEM_VIEW",
			"Atividades",
			"ATIVIDADE_VIEW",
			"Usuários",
			"USUARIO_VIEW",
			"Anotações / Portfólio",
			"PORTFOLIO_VIEW",
			"Funções e Permissões",
			"FUNCAO_VIEW"
		);

		Set<String> activeAreas = permissions
			.stream()
			.map(Permission::getArea)
			.filter(Objects::nonNull)
			.collect(Collectors.toSet());

		for (String area : activeAreas) {
			String viewPermCode = areaToViewPermission.get(area);
			if (viewPermCode != null) {
				boolean hasView = permissions.stream().anyMatch(p -> viewPermCode.equalsIgnoreCase(p.getPermission()));
				if (!hasView) {
					permissionsRepository.findByPermission(viewPermCode).ifPresent(permissions::add);
				}
			}
		}
	}
}
