package br.com.sondsp.repositories;

import br.com.sondsp.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface RolesRepository extends JpaRepository<Role, Integer> {
    Optional<Role> getRoleByName(String name);

    Optional<Role> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);

    List<Role> findAllByOrderByIdAsc();

    Set<Role> findAllByIdIn(Collection<Integer> ids);

    Set<Role> findAllByNameIn(Collection<String> names);
}
