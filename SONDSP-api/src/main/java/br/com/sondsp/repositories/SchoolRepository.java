package br.com.sondsp.repositories;

import br.com.sondsp.entities.School;
import br.com.sondsp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface SchoolRepository extends JpaRepository<School, Integer>, JpaSpecificationExecutor<School> {
    List<School> getByNameContaining(String name);
}
