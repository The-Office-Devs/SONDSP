package br.com.sondsp.services;

import static br.com.sondsp.util.SystemMessages.SCHOOL_CLASS_ALREADY_EXISTS;
import static br.com.sondsp.util.SystemMessages.SCHOOL_CLASS_CANNOT_ACTIVATE;
import static br.com.sondsp.util.SystemMessages.SCHOOL_CLASS_CANNOT_INACTIVATE;
import static br.com.sondsp.util.SystemMessages.SCHOOL_CLASS_NOT_FOUND;

import br.com.sondsp.dtos.StudentsPannelDTO;
import br.com.sondsp.entities.School;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.entities.Student;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import br.com.sondsp.repositories.SchoolClassRepository;
import br.com.sondsp.repositories.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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
