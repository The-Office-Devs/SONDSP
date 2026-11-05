package br.com.sondsp.repositories;

import br.com.sondsp.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PermissionsRepository extends JpaRepository<Permission, Integer> {
    Set<Permission> findAllByPermissionIn(Collection<String> permissions);

    Set<Permission> findAllByIdIn(Collection<Integer> ids);

    List<Permission> findAllByOrderByAreaAscPermissionAsc();

    Optional<Permission> findByPermission(String permission);
}
