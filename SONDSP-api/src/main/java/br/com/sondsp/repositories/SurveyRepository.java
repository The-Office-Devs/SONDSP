package br.com.sondsp.repositories;

import br.com.sondsp.entities.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Integer>, JpaSpecificationExecutor<Survey> {
	Boolean existsByStudentIdAndActivityIdAndStatus(Integer studentId, Integer activityId, Boolean status);

	List<Survey> findAllByStudentIdAndStatusTrueOrderByDateAsc(Integer studentId);

	List<Survey> findAllByStudentIdAndActivityStrandIdAndStatusTrueOrderByDateAsc(Integer studentId, Integer strandId);
}
