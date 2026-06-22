package br.com.sondsp.repositories;

import br.com.sondsp.entities.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SchoolRepository extends JpaRepository<School, Integer>, JpaSpecificationExecutor<School> {
}
