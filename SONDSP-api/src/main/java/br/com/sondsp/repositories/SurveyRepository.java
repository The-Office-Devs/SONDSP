package br.com.sondsp.repositories;

import br.com.sondsp.entities.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Integer>, JpaSpecificationExecutor<Survey> {
	Boolean existsByStudentIdAndActivityIdAndStatus(Integer studentId, Integer activityId, Boolean status);
}
