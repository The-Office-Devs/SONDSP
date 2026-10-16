package br.com.sondsp.repositories;

import br.com.sondsp.entities.StudentAnnotation;
import br.com.sondsp.entities.enums.AnnotationTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentAnnotationRepository extends JpaRepository<StudentAnnotation, Integer>, JpaSpecificationExecutor<StudentAnnotation> {

    Page<StudentAnnotation> findAllByStudentIdOrderByCreatedAtDesc(Integer studentId, Pageable pageable);

    @Query("SELECT a FROM StudentAnnotation a WHERE a.student.id = :studentId AND :tag MEMBER OF a.tags ORDER BY a.createdAt DESC")
    Page<StudentAnnotation> findAllByStudentIdAndTag(@Param("studentId") Integer studentId, @Param("tag") AnnotationTag tag, Pageable pageable);
}
