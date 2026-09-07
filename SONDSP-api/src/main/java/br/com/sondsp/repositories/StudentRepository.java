package br.com.sondsp.repositories;

import br.com.sondsp.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer>, JpaSpecificationExecutor<Student> {
    List<Student> findAllBySchoolClassIdAndStatusTrue(Integer id);
    Boolean existsBySchoolClassIdAndRowNumberAndIdNot(Integer schoolClassId, Integer rowNumberm, Integer studentId);
    Boolean existsBySchoolClassIdAndRowNumber(Integer schoolClassId, Integer rowNumberm);
    Boolean existsByRegistration(String registration);
    Boolean existsByRegistrationAndIdNot(String registration, Integer id);
}
