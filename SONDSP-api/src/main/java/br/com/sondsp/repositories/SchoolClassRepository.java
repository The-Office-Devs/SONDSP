package br.com.sondsp.repositories;

import br.com.sondsp.entities.SchoolClass;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

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
}
