package br.com.sondsp.repositories;

import br.com.sondsp.entities.School;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolRepository extends JpaRepository<School, Integer> {
    School getByNameContaining(String name);
}
