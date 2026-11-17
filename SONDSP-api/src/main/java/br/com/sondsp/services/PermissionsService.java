package br.com.sondsp.services;

import br.com.sondsp.entities.Permission;
import br.com.sondsp.repositories.PermissionsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@AllArgsConstructor
public class PermissionsService {

	private final PermissionsRepository repository;

	public Set<Permission> getAllPermissionsIdIn(Set<Integer> ids) {
		if (ids == null || ids.isEmpty()) return new HashSet<>();

		return repository.findAllByIdIn(ids);
	}

	public Permission findViewPermissionByArea(String area) {
		return repository.findByAreaAndPermissionEndingWith(area, "VIEW").orElse(null);
	}

	public Set<Permission> findAllByOrderByAreaAscPermissionAsc() {
		return repository.findAllByOrderByAreaAscPermissionAsc();
	}
}
