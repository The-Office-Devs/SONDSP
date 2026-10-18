package br.com.sondsp.repositories;

import br.com.sondsp.dtos.SurveyResultDTO;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.repositories.projections.SchoolClassSurveysProjection;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

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
                ROW_NUMBER() OVER (
                    PARTITION BY so.id_aluno 
                    ORDER BY 
                        CASE 
                            WHEN LOWER(so.bimestre_aplicacao) LIKE '%4%' OR LOWER(so.bimestre_aplicacao) LIKE '%quarto%' THEN 4
                            WHEN LOWER(so.bimestre_aplicacao) LIKE '%3%' OR LOWER(so.bimestre_aplicacao) LIKE '%terceiro%' THEN 3
                            WHEN LOWER(so.bimestre_aplicacao) LIKE '%2%' OR LOWER(so.bimestre_aplicacao) LIKE '%segundo%' THEN 2
                            WHEN LOWER(so.bimestre_aplicacao) LIKE '%1%' OR LOWER(so.bimestre_aplicacao) LIKE '%primeiro%' THEN 1
                            WHEN LOWER(so.bimestre_aplicacao) LIKE '%inic%' THEN 0
                            ELSE -1
                        END DESC,
                        so.data DESC,
                        so.id DESC
                ) AS rn
            FROM sondagem so
            JOIN atividade atv ON atv.id = so.id_atividade
            WHERE atv.id_eixo = :strandId 
              AND so.status = true
              AND (CAST(:applicationPeriod AS text) IS NULL OR CAST(:applicationPeriod AS text) = '' OR so.bimestre_aplicacao = :applicationPeriod)
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

	@Query(
		value = """
			WITH ultima_sondagem AS (
			   SELECT
				   s.id_aluno,
				   s.bimestre_aplicacao,
				   s.resultado,
				   ROW_NUMBER() OVER (
					   PARTITION BY s.id_aluno, s.bimestre_aplicacao
					   ORDER BY s.data DESC, s.id DESC
				   ) AS rn
			   FROM sondagem s
			   JOIN atividade a ON s.id_atividade = a.id
			   WHERE s.status = true
			   AND a.id_eixo = :strandId
		   )
		   SELECT
			   al.id AS studentId,
			   al.nome AS studentName,
			   MAX(CASE WHEN us.bimestre_aplicacao = 'Inicial' THEN us.resultado END) AS initial,
			   MAX(CASE WHEN us.bimestre_aplicacao = '1° Bimestre' THEN us.resultado END) AS fstPeriod,
			   MAX(CASE WHEN us.bimestre_aplicacao = '2° Bimestre' THEN us.resultado END) AS sndPeriod,
			   MAX(CASE WHEN us.bimestre_aplicacao = '3° Bimestre' THEN us.resultado END) AS trdPeriod,
			   MAX(CASE WHEN us.bimestre_aplicacao = '4° Bimestre' THEN us.resultado END) AS frtPeriod
		   FROM aluno al
		   LEFT JOIN ultima_sondagem us ON al.id = us.id_aluno AND us.rn = 1
		   WHERE al.id_turma = :schoolClassId
		   GROUP BY al.id, al.nome
		   ORDER BY al.nome;
		""",
		nativeQuery = true
	)
	List<Tuple> getStudentsTrajectory(@Param("schoolClassId") Integer schoolClassId, @Param("strandId") Integer strandId);

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
			st.code,
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

	Optional<SchoolClass> findByCodigoInterno(String codigoInterno);

	Optional<SchoolClass> findBySchoolIdAndNameAndGradeLevelAndSchoolYearAndShiftAndCodigoInternoIsNull(
			Integer schoolId, String name, String gradeLevel, String schoolYear, String shift);

}
