package br.com.sondsp.repositories;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.entities.Strand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StrandRepository extends JpaRepository<Strand, Integer>, JpaSpecificationExecutor<Strand> {

    List<StrandDTO> findAllBySubject(String subject);

    List<StrandDTO> findAllBySubjectAndStatusTrue(String subject, Boolean status);
}