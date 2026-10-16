package br.com.sondsp.repositories;

import br.com.sondsp.entities.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Integer>, JpaSpecificationExecutor<StudentEnrollment> {
    List<StudentEnrollment> findAllByStudentIdOrderBySchoolYearDescStartDateDesc(Integer studentId);
}
