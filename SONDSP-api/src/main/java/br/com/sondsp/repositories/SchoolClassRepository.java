package br.com.sondsp.repositories;

import br.com.sondsp.entities.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, Integer>, JpaSpecificationExecutor<SchoolClass> {
}
