package br.com.sondsp.repositories;

import br.com.sondsp.entities.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, Integer>, JpaSpecificationExecutor<SchoolClass> {
    List<SchoolClass> findAllBySchoolId(Integer schoolId);
    Boolean existsBySchoolIdAndNameAndSchoolYear(Integer schoolId, String name, String schoolYear);
    Boolean existsBySchoolIdAndNameAndSchoolYearAndIdNot(Integer schoolId, String name, String schoolYear, Integer id);
}
