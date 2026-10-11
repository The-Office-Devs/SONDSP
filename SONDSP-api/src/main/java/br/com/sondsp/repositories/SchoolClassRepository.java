package br.com.sondsp.repositories;

import br.com.sondsp.entities.SchoolClass;
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
                so.data,
                us.id AS applier_id,
                us.nome AS applier_name,
                ROW_NUMBER() OVER (PARTITION BY so.id_aluno ORDER BY so.data DESC) AS rn
            FROM sondagem so
            JOIN usuario us ON us.id = so.id_aplicador
            JOIN atividade atv ON atv.id = so.id_atividade
            WHERE atv.id_eixo = :strandId 
              AND so.bimestre_aplicacao = :aplicationPeriod
        )
        SELECT 
            CAST(al.id AS integer) AS studentid,
            al.nome AS studentname,
            al.num_chamada AS rownumber,
            CAST(sf.survey_id AS integer) AS surveyid,
            CAST(sf.applier_id AS integer) AS applierid,
            sf.applier_name AS appliername,
            COALESCE(sf.resultado, 'SEM_REGISTRO') AS result,
            CAST(sf.data AS timestamp) AS data
        FROM aluno al
        LEFT JOIN sondagens_filtradas sf ON sf.id_aluno = al.id AND sf.rn = 1
        WHERE al.id_turma = :schoolClassId
          AND al.status = true
        ORDER BY al.num_chamada ASC;
        """,
		nativeQuery = true
	)
	List<Tuple> getStudentsSumary(
		@Param("schoolClassId") Integer schoolClassId,
		@Param("aplicationPeriod") String aplicationPeriod,
		@Param("strandId") Integer strandId
	);
}
