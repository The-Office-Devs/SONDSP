package br.com.sondsp.services;

import br.com.sondsp.dtos.GroupedPermissionsDTO;
import br.com.sondsp.dtos.PermissionDTO;
import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.Role;
import br.com.sondsp.form.RoleForm;
import br.com.sondsp.repositories.RolesRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static br.com.sondsp.util.SystemMessages.*;

@Service
@AllArgsConstructor
public class RolesService {

	private final RolesRepository repository;
	private final PermissionsService permissionsService;

	public List<Role> getAllRoles() {
		return repository.findAllByOrderByIdAsc();
	}

	public Role getRoleById(Integer id) {
		return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND));
	}

	@Transactional
	public Role createRole(RoleForm form) {
		String normalizedName = form.name().trim();

		if (repository.existsByNameIgnoreCase(normalizedName)) {
			throw new ValidationException(ROLE_ALREADY_EXISTS);
		}

		Set<Permission> permissions = permissionsService.getAllPermissionsIdIn(form.permissionIds());
		ensureViewPermissions(permissions);

		Role role = Role.builder().name(normalizedName).permissions(permissions).build();

		return repository.save(role);
	}

	@Transactional
	public Role updateRole(Integer id, RoleForm form) {
		Role role = getRoleById(id);

		if (role.isAdmin()) {
			throw new ValidationException(ADMIN_ROLE_CANNOT_BE_MODIFIED);
		}

		String normalizedName = form.name().trim();

		if (repository.existsByNameIgnoreCaseAndIdNot(normalizedName, id)) {
			throw new ValidationException(ROLE_ALREADY_EXISTS);
		}

		role.setName(normalizedName);

		Set<Permission> permissions = permissionsService.getAllPermissionsIdIn(form.permissionIds());
		ensureViewPermissions(permissions);

		role.setPermissions(permissionsService.getAllPermissionsIdIn(form.permissionIds()));

		return repository.save(role);
	}

	@Transactional
	public void deleteRole(Integer id) {
		Role role = getRoleById(id);

		if (role.isAdmin()) {
			throw new ValidationException(ADMIN_ROLE_CANNOT_BE_DELETED);
		}

		repository.delete(role);
	}

	public Set<GroupedPermissionsDTO> getGroupedPermissions() {
		Set<Permission> permissions = permissionsService.findAllByOrderByAreaAscPermissionAsc();
		Map<String, Set<PermissionDTO>> groupedMap = new LinkedHashMap<>();

		for (Permission permission : permissions) {
			String area = permission.getArea() != null && !permission.getArea().isBlank()
				? permission.getArea()
				: "Geral";

			groupedMap.computeIfAbsent(area, k -> new HashSet<>()).add(new PermissionDTO(permission));
		}

		Set<GroupedPermissionsDTO> result = new HashSet<>();
		groupedMap.forEach((area, list) -> result.add(new GroupedPermissionsDTO(area, list)));
		return result;
	}

	private void ensureViewPermissions(Set<Permission> permissions) {
		if (permissions == null || permissions.isEmpty()) return;

		for (Permission permission : permissions) {
			Permission viewPermission = permissionsService.findViewPermissionByArea(permission.getArea());

			if (viewPermission != null) permissions.add(viewPermission);
		}
	}
}
