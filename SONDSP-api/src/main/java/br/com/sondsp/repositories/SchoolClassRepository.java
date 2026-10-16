package br.com.sondsp.repositories;

import br.com.sondsp.dtos.SurveyResultDTO;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.repositories.projections.SchoolClassSurveysProjection;
import jakarta.persistence.Tuple;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SchoolClassRepository
	extends JpaRepository<SchoolClass, Integer>, JpaSpecificationExecutor<SchoolClass> {
	List<SchoolClass> findAllBySchoolId(Integer schoolId);

	Boolean existsBySchoolIdAndNameAndGradeLevelAndSchoolYearAndShift(
		Integer schoolId,
		String name,
		String gradeLevel,
		String schoolYear,
		String shift
	);

	Boolean existsBySchoolIdAndNameAndGradeLevelAndSchoolYearAndShiftAndIdNot(
		Integer schoolId,
		String name,
		String gradeLevel,
		String schoolYear,
		String shift,
		Integer id
	);

	@Query(
			value = """
        WITH sondagens_filtradas AS (
            SELECT 
                so.id AS survey_id,
                so.id_aluno,
                so.resultado,
                ROW_NUMBER() OVER (PARTITION BY so.id_aluno ORDER BY so.data DESC) AS rn
            FROM sondagem so
            JOIN atividade atv ON atv.id = so.id_atividade
            WHERE atv.id_eixo = :strandId 
              AND so.status = true
              AND (CAST(:applicationPeriod AS text) IS NULL OR so.bimestre_aplicacao = :applicationPeriod)
        )
        SELECT 
            CAST(al.id AS integer) AS studentid,
            al.nome AS studentname,
            sf.resultado AS result
        FROM aluno al
        LEFT JOIN sondagens_filtradas sf ON sf.id_aluno = al.id AND sf.rn = 1
        WHERE al.id_turma = :schoolClassId
          AND al.status = true
        ORDER BY al.nome ASC;
        """,
			nativeQuery = true
	)
	List<Tuple> getStudentsSumary(
		@Param("schoolClassId") Integer schoolClassId,
		@Param("applicationPeriod") String applicationPeriod,
		@Param("strandId") Integer strandId
	);

	@Query(value = """
	SELECT
		tu.ano_escolar	as gradeLevel,
		es.nome			as schoolName,
		null			as teacher,
		tu.nome			as schoolClass,
		tu.ano_letivo	as schoolYear
	FROM turma tu
	INNER JOIN escola es
		ON es.id = tu.id_escola
	WHERE tu.id = :schoolClassId
	""", nativeQuery = true)
	List<SchoolClassSurveysProjection> findSheetContentWithFilters(@Param("schoolClassId") Integer schoolClassId);

	@Query("""
        SELECT new br.com.sondsp.dtos.SurveyResultDTO(
            s.student.id,
            st.id,
            st.name,
            s.applicationPeriod,
            s.result,
            s.date,
            s.id
        )
        FROM Survey s
        JOIN s.student stu
        JOIN stu.schoolClass sc
        JOIN s.activity a
        JOIN a.strand st
        WHERE sc.id = :schoolClassId
          AND s.status = true
          AND stu.status = true
    """)
	List<SurveyResultDTO> findSurveyResultsBySchoolClass(@Param("schoolClassId") Integer schoolClassId);
}
