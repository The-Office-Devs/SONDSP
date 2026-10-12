package br.com.sondsp.repositories;

import br.com.sondsp.entities.SchoolClassAnnotation;
import br.com.sondsp.entities.SchoolClassAnnotationID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchoolClassAnnotationRepository
        extends JpaRepository<SchoolClassAnnotation, SchoolClassAnnotationID>,
                JpaSpecificationExecutor<SchoolClassAnnotation> {
    @Query("SELECT MAX(a.id.id) FROM SchoolClassAnnotation a WHERE a.id.schoolClassId = :schoolClassId")
    Optional<Integer> findMaxIdBySchoolClassId(@Param("schoolClassId") Integer schoolClassId);
}