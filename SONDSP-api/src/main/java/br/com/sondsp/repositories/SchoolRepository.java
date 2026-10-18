package br.com.sondsp.repositories;

import br.com.sondsp.entities.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface SchoolRepository extends JpaRepository<School, Integer>, JpaSpecificationExecutor<School> {
    boolean existsByCodigoInep(String codigoInep);
    boolean existsByCodigoInepAndIdNot(String codigoInep, Integer id);
    Optional<School> findByCodigoInterno(String codigoInterno);
}
