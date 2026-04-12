package br.com.sondsp.repositories;

import br.com.sondsp.entities.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolesRepository extends JpaRepository<Roles, Integer> {
    Roles getRoleByName(String name);
}
