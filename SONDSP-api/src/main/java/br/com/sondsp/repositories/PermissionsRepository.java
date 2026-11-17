package br.com.sondsp.repositories;

import br.com.sondsp.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface PermissionsRepository extends JpaRepository<Permission, Integer> {
	Set<Permission> findAllByIdIn(Collection<Integer> ids);

	Optional<Permission> findByAreaAndPermissionEndingWith(String area, String suffix);

	Set<Permission> findAllByPermissionIn(Collection<String> permissions);

	Set<Permission> findAllByOrderByAreaAscPermissionAsc();

	Optional<Permission> findByPermission(String permission);
}
