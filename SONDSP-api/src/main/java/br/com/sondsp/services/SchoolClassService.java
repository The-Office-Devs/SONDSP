package br.com.sondsp.services;

import br.com.sondsp.dtos.*;
import br.com.sondsp.entities.*;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import br.com.sondsp.repositories.SchoolClassRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.repositories.projections.SchoolClassSurveysProjection;
import br.com.sondsp.util.SurveyPeriod;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.*;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.text.Collator;
import java.util.*;

import static br.com.sondsp.util.SystemMessages.*;

@Slf4j
@Service
@AllArgsConstructor
public class SchoolClassService {

	private SchoolClassRepository repository;
	private SchoolService schoolService;
	private StudentRepository studentRepository;

	public SchoolClass createSchoolClass(SchoolClassForm form) {
		if (
			repository.existsBySchoolIdAndNameAndGradeLevelAndSchoolYearAndShift(
				form.schoolId(),
				form.name(),
				form.gradeLevel(),
				form.schoolYear(),
				form.shift()
			)
		) throw new ValidationException(SCHOOL_CLASS_ALREADY_EXISTS);

		School school = schoolService.getSchool(form.schoolId());

		return repository.save(
			SchoolClass
				.builder()
				.name(form.name())
				.gradeLevel(form.gradeLevel())
				.schoolYear(form.schoolYear())
				.shift(form.shift())
				.school(school)
				.status(true)
				.build()
		);
	}

	public SchoolClass getSchoolClass(Integer id) {
		return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(SCHOOL_CLASS_NOT_FOUND));
	}

	public Page<SchoolClass> getSchoolsClasses(SchoolClassFilter filter, Pageable pageable) {
		Specification<SchoolClass> spec = buildFilter(filter);
		return repository.findAll(spec, pageable);
	}

	public List<StudentsPannelDTO> getStudentsPannel(Integer schoolClassId, String applicationPeriod, Integer strandId) {
		getSchoolClass(schoolClassId);

		List<Tuple> tuples = repository.getStudentsSumary(schoolClassId, applicationPeriod, strandId);

		return tuples
			.stream()
			.map(tuple ->
				new StudentsPannelDTO(
					tuple.get("studentid", Integer.class),
					tuple.get("studentname", String.class),
					tuple.get("result", String.class)
				)
			)
			.toList();
	}

	public List<StudentsTrajectoryDTO> getStudentsTrajectory(Integer schoolClassId, Integer strandId) {
		getSchoolClass(schoolClassId);

		List<Tuple> tuples = repository.getStudentsTrajectory(schoolClassId, strandId);

		return tuples
			.stream()
			.map(tuple ->
				new StudentsTrajectoryDTO(
					new StudentSimplestDTO(
							tuple.get("studentId", Integer.class),
							tuple.get("studentName", String.class)),
					new TrajectoryResultDTO(
							tuple.get("initial", String.class),
							tuple.get("fstPeriod", String.class),
							tuple.get("sndPeriod", String.class),
							tuple.get("trdPeriod", String.class),
							tuple.get("frtPeriod", String.class))
				))
			.toList();
	}

	public SchoolClass updateSchoolClass(Integer id, SchoolClassForm form) {
		if (
			repository.existsBySchoolIdAndNameAndGradeLevelAndSchoolYearAndShiftAndIdNot(
				form.schoolId(),
				form.name(),
				form.gradeLevel(),
				form.schoolYear(),
				form.shift(),
				id
			)
		) throw new ValidationException(SCHOOL_CLASS_ALREADY_EXISTS);

		SchoolClass schoolClass = getSchoolClass(id);

		schoolClass.setName(form.name());
		schoolClass.setGradeLevel(form.gradeLevel());
		schoolClass.setSchoolYear(form.schoolYear());
		schoolClass.setShift(form.shift());

		if (!java.util.Objects.equals(schoolClass.getSchool().getId(), form.schoolId())) {
			schoolClass.setSchool(schoolService.getSchool(form.schoolId()));
		}

		return repository.save(schoolClass);
	}

	public Boolean changeStatus(Integer id) {
		SchoolClass schoolClass = getSchoolClass(id);

		// Se a turma estiver inativa e a escola também
		if (
			!schoolClass.getStatus() && !schoolService.getSchool(schoolClass.getSchool().getId()).getStatus()
		) throw new ValidationException(SCHOOL_CLASS_CANNOT_ACTIVATE);

		List<Student> students = studentRepository.findAllBySchoolClassIdAndStatusTrue(id);

		if (!students.isEmpty()) {
			throw new ValidationException(SCHOOL_CLASS_CANNOT_INACTIVATE);
		}

		schoolClass.setStatus(!schoolClass.getStatus());
		repository.save(schoolClass);

		return schoolClass.getStatus();
	}

	public SchoolClassSurveysReportDTO getSchoolClassSurveys(Integer schoolClassId) {
		SchoolClassSurveysProjection header = repository
				.findSheetContentWithFilters(schoolClassId)
				.stream()
				.findFirst()
				.orElseThrow(() -> new EntityNotFoundException(SCHOOL_CLASS_NOT_FOUND));

		Collator collator = Collator.getInstance(Locale.forLanguageTag("pt-BR"));

		List<Student> students = studentRepository
				.findAllBySchoolClassIdAndStatusTrue(schoolClassId)
				.stream()
				.sorted(
						Comparator
								.<Student, Integer>comparing(Student::getRowNumber, Comparator.nullsLast(Comparator.naturalOrder()))
								.thenComparing(student -> Objects.toString(student.getName(), ""), collator)
				)
				.toList();

		Map<ResultKey, SurveyResultDTO> latest = new HashMap<>();
		Map<Integer, String> strandNames = new HashMap<>();

		for (SurveyResultDTO survey : repository.findSurveyResultsBySchoolClass(schoolClassId)) {
			Optional<SurveyPeriod> period = SurveyPeriod.fromValue(survey.applicationPeriod());
			if (period.isEmpty()) {
				log.warn(
						"Sondagem {} ignorada no relatório: período de aplicação não reconhecido ({}).",
						survey.surveyId(),
						survey.applicationPeriod()
				);
				continue;
			}

			strandNames.putIfAbsent(survey.strandId(), Objects.toString(survey.strandName(), ""));

			ResultKey key = new ResultKey(survey.studentId(), survey.strandId(), period.get());
			SurveyResultDTO current = latest.get(key);
			if (current == null || isNewer(survey, current)) latest.put(key, survey);
		}

		if (strandNames.isEmpty()) throw new ValidationException(NULL_SURVEYS_IN_CLASS);

		List<Integer> strandIds = strandNames
				.keySet()
				.stream()
				.sorted((a, b) -> collator.compare(strandNames.get(a), strandNames.get(b)))
				.toList();

		SurveyPeriod[] periods = SurveyPeriod.values();
		List<SchoolClassSurveysReportDTO.StrandSheet> sheets = new ArrayList<>();

		for (Integer strandId : strandIds) {
			List<SchoolClassSurveysReportDTO.StudentRow> rows = new ArrayList<>();

			for (Student student : students) {
				List<String> results = new ArrayList<>(periods.length);
				for (SurveyPeriod period : periods) {
					SurveyResultDTO survey = latest.get(new ResultKey(student.getId(), strandId, period));
					results.add(survey == null ? null : survey.result());
				}

				int number = student.getRowNumber() != null ? student.getRowNumber() : rows.size() + 1;
				rows.add(new SchoolClassSurveysReportDTO.StudentRow(number, student.getName(), results));
			}

			sheets.add(new SchoolClassSurveysReportDTO.StrandSheet(strandId, strandNames.get(strandId), rows));
		}

		return new SchoolClassSurveysReportDTO(header, sheets);
	}

	private record ResultKey(Integer studentId, Integer strandId, SurveyPeriod period) {}

	private static boolean isNewer(SurveyResultDTO candidate, SurveyResultDTO current) {
		int byDate = compareNullsFirst(candidate.date(), current.date());
		if (byDate != 0) return byDate > 0;
		return compareNullsFirst(candidate.surveyId(), current.surveyId()) > 0;
	}

	private static <T extends Comparable<? super T>> int compareNullsFirst(T a, T b) {
		if (a == null) return b == null ? 0 : -1;
		if (b == null) return 1;
		return a.compareTo(b);
	}

	private Specification<SchoolClass> buildFilter(SchoolClassFilter filter) {
		return (root, query, criteriaBuilder) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (filter == null) return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

			if (filter.search() != null && !filter.search().isBlank()) {
				Join<SchoolClass, School> schoolJoin = root.join("school", JoinType.INNER);

				String search = filter.search().toLowerCase();
				String searchPattern = "%" + search + "%";

				List<Predicate> orPredicates = new ArrayList<>();
				orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(schoolJoin.get("name")), searchPattern));
				orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern));
				orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("gradeLevel")), searchPattern));
				orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("schoolYear")), searchPattern));
				orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("shift")), searchPattern));
				if (search.matches("\\d{1,9}")) orPredicates.add(
					criteriaBuilder.equal(root.get("numStudents"), Integer.valueOf(search))
				);

				Boolean status = null;
				if ("ativo".startsWith(search)) {
					status = true;
				} else if ("inativo".startsWith(search)) {
					status = false;
				}

				if (status != null) orPredicates.add(criteriaBuilder.equal(root.get("status"), status));

				predicates.add(criteriaBuilder.or(orPredicates.toArray(new Predicate[0])));
			}

			if (filter.schoolId() != null) {
				Join<SchoolClass, School> schoolJoin = root.join("school", JoinType.INNER);

				predicates.add(criteriaBuilder.equal(schoolJoin.get("id"), filter.schoolId()));
			}

			if (filter.schoolName() != null && !filter.schoolName().isBlank()) {
				Join<SchoolClass, School> schoolJoin = root.join("school", JoinType.INNER);

				predicates.add(
					criteriaBuilder.like(
						criteriaBuilder.lower(schoolJoin.get("name")),
						"%" + filter.schoolName().toLowerCase() + "%"
					)
				);
			}

			if (filter.name() != null && !filter.name().isBlank()) {
				predicates.add(
					criteriaBuilder.like(
						criteriaBuilder.lower(root.get("name")),
						"%" + filter.name().toLowerCase() + "%"
					)
				);
			}

			if (filter.gradeLevel() != null && !filter.gradeLevel().isBlank()) {
				predicates.add(criteriaBuilder.equal(root.get("gradeLevel"), filter.gradeLevel()));
			}

			if (filter.schoolYear() != null && !filter.schoolYear().isBlank()) {
				predicates.add(criteriaBuilder.equal(root.get("schoolYear"), filter.schoolYear()));
			}

			if (filter.shift() != null && !filter.shift().isBlank()) {
				predicates.add(criteriaBuilder.equal(root.get("shift"), filter.shift()));
			}

			if (filter.numStudents() != null) {
				predicates.add(criteriaBuilder.equal(root.get("numStudents"), filter.numStudents()));
			}

			if (filter.status() != null) predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));

			if (Boolean.TRUE.equals(filter.hasStudents())) predicates.add(
				criteriaBuilder.greaterThan(root.get("numStudents"), 0)
			);

			return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
		};
	}
}
