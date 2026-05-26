package br.com.sondsp.repositories;

import br.com.sondsp.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PermissionsRepository extends JpaRepository<Permission, Integer> {
    Set<Permission> findAllByPermissionIn(List<String> permissions);
}
