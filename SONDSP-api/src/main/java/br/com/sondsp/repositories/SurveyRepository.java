package br.com.sondsp.repositories;

import br.com.sondsp.entities.Survey;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Integer>, JpaSpecificationExecutor<Survey> {
	Boolean existsByStudentIdAndActivityIdAndStatus(Integer studentId, Integer activityId, Boolean status);

	List<Survey> findAllByStudentIdAndStatusTrueOrderByDateAsc(Integer studentId);

	List<Survey> findAllByStudentIdAndActivityStrandIdAndStatusTrueOrderByDateAsc(Integer studentId, Integer strandId);

	@Query(
		"SELECT s FROM Survey s " +
		"JOIN FETCH s.activity a " +
		"JOIN FETCH a.strand st " +
		"JOIN FETCH s.student stu " +
		"WHERE stu.schoolClass.id = :schoolClassId " +
		"AND st.id = :strandId " +
		"AND s.status = true " +
		"AND s.result IS NOT NULL " +
		"ORDER BY s.date DESC, s.id DESC"
	)
	List<Survey> findCompletedSurveysByClassAndStrand(
		@Param("schoolClassId") Integer schoolClassId,
		@Param("strandId") Integer strandId
	);
}
