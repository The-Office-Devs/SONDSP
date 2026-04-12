package br.com.sondsp.repositories;

import br.com.sondsp.entities.Permissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PermissionsRepository extends JpaRepository<Permissions, Integer> {
    Set<Permissions> findAllByPermissionIn(List<String> permissions);
}
