package br.com.sondsp.services;

import br.com.sondsp.dtos.*;
import br.com.sondsp.entities.*;
import br.com.sondsp.filters.ClassMapFilter;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import br.com.sondsp.repositories.ActivityRepository;
import br.com.sondsp.repositories.SchoolClassRepository;
import br.com.sondsp.repositories.StrandRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.repositories.SurveyRepository;
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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Collator;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static br.com.sondsp.util.SystemMessages.*;

@Slf4j
@Service
@AllArgsConstructor
public class SchoolClassService {

	private static final List<String> DEFAULT_LEVELS = List.of("PS", "SV", "CV", "SA", "ALF");

	private SchoolClassRepository repository;
	private SchoolService schoolService;
	private StudentRepository studentRepository;
	private StrandRepository strandRepository;
	private ActivityRepository activityRepository;
	private SurveyRepository surveyRepository;

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

	public ClassMapDTO getClassMap(Integer id, ClassMapFilter filter) {
		SchoolClass schoolClass = getSchoolClass(id);

		if (filter == null || filter.strandId() == null) {
			throw new ValidationException(EMPTY_STRAND);
		}

		Strand strand = strandRepository
			.findById(filter.strandId())
			.orElseThrow(() -> new EntityNotFoundException(STRAND_NOT_FOUND));

		List<Student> activeStudents = studentRepository.findAllBySchoolClassIdAndStatusTrue(id);
		Set<Integer> activeStudentIds = activeStudents.stream().map(Student::getId).collect(Collectors.toSet());

		String filterPeriod = (filter.period() != null && !filter.period().isBlank()) ? filter.period().trim() : null;

		List<Activity> activeActivities = activityRepository.findAllByStrandIdAndStatusTrue(strand.getId());

		List<Survey> allSurveys = surveyRepository.findCompletedSurveysByClassAndStrand(id, strand.getId());

		List<Survey> validSurveys = allSurveys
			.stream()
			.filter(s -> s.getStudent() != null && activeStudentIds.contains(s.getStudent().getId()))
			.filter(s -> s.getResult() != null && !s.getResult().trim().isEmpty())
			.toList();

		Map<Integer, List<Survey>> surveysByStudent = validSurveys
			.stream()
			.collect(Collectors.groupingBy(s -> s.getStudent().getId()));

		Map<Integer, Survey> latestSurveyByStudent = new HashMap<>();
		Map<Integer, Survey> previousSurveyByStudent = new HashMap<>();

		for (Student student : activeStudents) {
			List<Survey> studentSurveys = surveysByStudent.getOrDefault(student.getId(), Collections.emptyList());
			if (studentSurveys.isEmpty()) continue;

			if (filterPeriod != null) {
				Survey latestInPeriod = studentSurveys
					.stream()
					.filter(s -> s.getActivity() != null && filterPeriod.equalsIgnoreCase(s.getActivity().getPeriod()))
					.findFirst()
					.orElse(null);

				if (latestInPeriod != null) {
					latestSurveyByStudent.put(student.getId(), latestInPeriod);

					Survey previous = studentSurveys
						.stream()
						.filter(s -> isStrictlyBefore(s, latestInPeriod))
						.findFirst()
						.orElse(null);

					if (previous != null) {
						previousSurveyByStudent.put(student.getId(), previous);
					}
				}
			} else {
				Survey latest = studentSurveys.get(0);
				latestSurveyByStudent.put(student.getId(), latest);

				if (studentSurveys.size() > 1) {
					previousSurveyByStudent.put(student.getId(), studentSurveys.get(1));
				}
			}
		}

		List<DistributionDTO> distribution = calculateDistribution(latestSurveyByStudent.values());

		List<EvolutionComparativeDTO> evolutionComparative = calculateEvolutionComparative(
			previousSurveyByStudent.values(),
			latestSurveyByStudent.values()
		);

		List<DomainPercentageDTO> domainPercentage = calculateDomainPercentage(
			activeActivities,
			activeStudents,
			validSurveys,
			filterPeriod
		);

		return new ClassMapDTO(
			schoolClass.getSchool() != null ? schoolClass.getSchool().getName() : null,
			schoolClass.getName(),
			domainPercentage,
			distribution,
			evolutionComparative
		);
	}

	private List<DistributionDTO> calculateDistribution(Collection<Survey> latestSurveys) {
		Map<String, Long> countByLevel = latestSurveys
			.stream()
			.map(s -> s.getResult().trim())
			.collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

		long totalEvaluated = latestSurveys.size();
		List<String> orderedLevels = getOrderedLevels(countByLevel.keySet());

		return orderedLevels
			.stream()
			.map(level -> {
				int count = countByLevel.getOrDefault(level, 0L).intValue();
				double percentage = totalEvaluated > 0 ? roundDouble(((double) count / totalEvaluated) * 100.0) : 0.0;
				return new DistributionDTO(level, count, percentage);
			})
			.toList();
	}

	private List<EvolutionComparativeDTO> calculateEvolutionComparative(
		Collection<Survey> previousSurveys,
		Collection<Survey> latestSurveys
	) {
		Map<String, Long> countAntes = previousSurveys
			.stream()
			.map(s -> s.getResult().trim())
			.collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

		Map<String, Long> countDepois = latestSurveys
			.stream()
			.map(s -> s.getResult().trim())
			.collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

		Set<String> allLevels = new HashSet<>();
		allLevels.addAll(countAntes.keySet());
		allLevels.addAll(countDepois.keySet());

		List<String> orderedLevels = getOrderedLevels(allLevels);

		return orderedLevels
			.stream()
			.map(level -> {
				int before = countAntes.getOrDefault(level, 0L).intValue();
				int after = countDepois.getOrDefault(level, 0L).intValue();
				return new EvolutionComparativeDTO(level, before, after);
			})
			.toList();
	}

	private List<DomainPercentageDTO> calculateDomainPercentage(
		List<Activity> activeActivities,
		List<Student> activeStudents,
		List<Survey> validSurveys,
		String filterPeriod
	) {
		Map<String, List<Activity>> activitiesByName = activeActivities
			.stream()
			.filter(a -> a.getName() != null && !a.getName().isBlank())
			.collect(Collectors.groupingBy(Activity::getName, LinkedHashMap::new, Collectors.toList()));

		if (activitiesByName.isEmpty()) {
			Set<String> distinctNames = validSurveys
				.stream()
				.filter(s ->
					s.getActivity() != null && s.getActivity().getName() != null && !s.getActivity().getName().isBlank()
				)
				.map(s -> s.getActivity().getName())
				.collect(Collectors.toCollection(LinkedHashSet::new));
			for (String actName : distinctNames) {
				activitiesByName.put(actName, Collections.emptyList());
			}
		}

		List<DomainPercentageDTO> result = new ArrayList<>();

		for (Map.Entry<String, List<Activity>> entry : activitiesByName.entrySet()) {
			String activityName = entry.getKey();
			List<Activity> activities = entry.getValue();
			Set<Integer> activityIds = activities.stream().map(Activity::getId).collect(Collectors.toSet());

			int expectedQuantity = 0;
			int totalAvaliados = 0;

			for (Student student : activeStudents) {
				List<Survey> studentActivitySurveys = validSurveys
					.stream()
					.filter(s -> s.getStudent() != null && Objects.equals(s.getStudent().getId(), student.getId()))
					.filter(s ->
						s.getActivity() != null &&
						(
							activityIds.contains(s.getActivity().getId()) ||
							activityName.equalsIgnoreCase(s.getActivity().getName())
						)
					)
					.toList();

				if (studentActivitySurveys.isEmpty()) continue;

				Survey targetSurvey;
				if (filterPeriod != null) {
					targetSurvey =
						studentActivitySurveys
							.stream()
							.filter(s ->
								s.getActivity() != null && filterPeriod.equalsIgnoreCase(s.getActivity().getPeriod())
							)
							.findFirst()
							.orElse(null);
				} else {
					targetSurvey = studentActivitySurveys.get(0);
				}

				if (targetSurvey != null) {
					totalAvaliados++;
					if (isExpectedLevel(targetSurvey.getResult())) {
						expectedQuantity++;
					}
				}
			}

			double percentual = totalAvaliados > 0
				? roundDouble(((double) expectedQuantity / totalAvaliados) * 100.0)
				: 0.0;

			result.add(new DomainPercentageDTO(activityName, expectedQuantity, totalAvaliados, percentual));
		}

		return result;
	}

	private boolean isStrictlyBefore(Survey s1, Survey s2) {
		if (s1.getDate() != null && s2.getDate() != null) {
			if (s1.getDate().isBefore(s2.getDate())) {
				return true;
			} else if (s1.getDate().isAfter(s2.getDate())) {
				return false;
			}
		}
		return s1.getId() != null && s2.getId() != null && s1.getId() < s2.getId();
	}

	private boolean isExpectedLevel(String result) {
		if (result == null) return false;
		String trimmed = result.trim().toUpperCase();
		return trimmed.equals("ALF") || trimmed.equals("ALFABÉTICO") || trimmed.equals("ALFABETICO");
	}

	private List<String> getOrderedLevels(Set<String> presentLevels) {
		List<String> result = new ArrayList<>(DEFAULT_LEVELS);
		for (String level : presentLevels) {
			if (!result.contains(level)) {
				result.add(level);
			}
		}
		return result;
	}

	private Double roundDouble(double value) {
		return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
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
