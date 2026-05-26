package br.com.sondsp.repositories;

import br.com.sondsp.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolesRepository extends JpaRepository<Role, Integer> {
    Role getRoleByName(String name);
}
