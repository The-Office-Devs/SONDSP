package br.com.sondsp.repositories;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.entities.Strand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StrandRepository extends JpaRepository<Strand, Integer> {

    Page<StrandDTO> findAllBy(Pageable pageable);

    Page<StrandDTO> findByNameContainingIgnoreCase(String name, Pageable pageable);
}