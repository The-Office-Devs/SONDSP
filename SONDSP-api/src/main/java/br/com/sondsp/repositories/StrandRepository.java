package br.com.sondsp.repositories;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.entities.Strand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StrandRepository extends JpaRepository<Strand, Integer> {
    List<StrandDTO> findAllByStatus(Boolean status);
}
