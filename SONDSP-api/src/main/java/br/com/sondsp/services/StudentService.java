package br.com.sondsp.services;

import br.com.sondsp.entities.School;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.entities.Student;
import br.com.sondsp.entities.User;
import br.com.sondsp.exceptions.UserAlreadyExistsException;
import br.com.sondsp.filters.StudentFilter;
import br.com.sondsp.form.StudentForm;
import br.com.sondsp.repositories.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

@Service
@AllArgsConstructor
public class StudentService {
    private StudentRepository repository;
    private SchoolClassService schoolClassService;

    public Student createStudent(StudentForm form) {
        if (repository.existsBySchoolClassIdAndRowNumber(form.schoolClassId(), form.rowNumber()))
            throw new ValidationException(ROW_NUMBER_TAKEN);

        if (repository.existsByRegistration(form.registration()))
            throw new ValidationException(STUDENT_REGISTRATION_ALREADY_EXISTS);

        return repository.save(Student.builder()
                .name(form.name())
                .registration(form.registration())
                .schoolClass(form.schoolClassId() != null ? schoolClassService.getSchoolClass(form.schoolClassId()) : null)
                .rowNumber(form.schoolClassId() != null ? form.rowNumber() : null)
                .status(true)
                .build());
    }

    public List<Student> createStudents(List<StudentForm> forms) {
        return forms.stream().map(this::createStudent).toList();
    }

    public Student getStudent(Integer id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(STUDENT_NOT_FOUND));
    }

    public Page<Student> getStudents(StudentFilter filter, Pageable pageable) {
        Specification<Student> spec = buildFilter(filter);
        return repository.findAll(spec, pageable);
    }

    public Student updateStudent(Integer id, StudentForm form) {
        Student student = getStudent(id);

        // Se o numero da chamada e a turma não forem nulos, valida se já existe
        if (form.rowNumber() != null && form.schoolClassId() != null) {
            if (repository.existsBySchoolClassIdAndRowNumberAndIdNot(form.schoolClassId(), form.rowNumber(), id))
                throw new ValidationException(ROW_NUMBER_TAKEN);
        }

        student.setSchoolClass(form.schoolClassId() != null
                ? schoolClassService.getSchoolClass(form.schoolClassId())
                : null);

        student.setRowNumber(form.rowNumber());
        student.setName(form.name());
        student.setRegistration(form.registration());

        return repository.save(student);
    }

    public Boolean changeStatus(Integer id) {
        Student student = getStudent(id);
        student.setStatus(!student.getStatus());
        repository.save(student);

        return student.getStatus();
    }

    private Specification<Student> buildFilter(StudentFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null)
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

            if (filter.search() != null && !filter.search().isBlank()) {
                Join<Student, SchoolClass> schoolClassJoin = root.join("schoolClass", JoinType.INNER);
                Join<SchoolClass, School> schoolJoin = schoolClassJoin.join("school", JoinType.INNER);

                String searchPattern = "%" + filter.search().toLowerCase() + "%";

                Expression<String> schoolClass = criteriaBuilder.concat(
                        criteriaBuilder.concat(schoolClassJoin.get("name"), " - "),
                        schoolJoin.get("name")
                );

                Expression<String> rowNumberString = criteriaBuilder.function(
                        "to_char", String.class,
                        root.get("rowNumber"),
                        criteriaBuilder.literal("FM999999999")
                );

                Predicate searchInName = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern);
                Predicate searchInRegistration = criteriaBuilder.like(criteriaBuilder.lower(root.get("registration")), searchPattern);
                Predicate searchInSchoolClass = criteriaBuilder.like(criteriaBuilder.lower(schoolClass), searchPattern);
                Predicate searchInRowNumber = criteriaBuilder.like(rowNumberString, searchPattern);

                Boolean status = switch (filter.search().toLowerCase()){
                    case "ativo" -> true;
                    case "inativo" -> false;
                    default -> null;
                };

                Predicate searchInStatus = criteriaBuilder.equal(root.get("status"), status);

                Predicate combinedSearchPredicate = criteriaBuilder.or(
                        searchInName, searchInRegistration, searchInSchoolClass, searchInRowNumber, searchInStatus);

                predicates.add(combinedSearchPredicate);
            } else {
                if (filter.name() != null && !filter.name().isBlank()) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));
                }

                if (filter.registration() != null && !filter.registration().isBlank()) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("registration")), "%" + filter.registration().toLowerCase() + "%"));
                }

                if (filter.schoolClassId() != null) {
                    Join<User, SchoolClass> schoolClassJoin = root.join("schoolClass", JoinType.INNER);
                    predicates.add(criteriaBuilder.equal(schoolClassJoin.get("id"), filter.schoolClassId()));
                }

                if (filter.schoolClassName() != null && !filter.schoolClassName().isBlank()) {
                    Join<User, SchoolClass> schoolClassJoin = root.join("schoolClass", JoinType.INNER);

                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(schoolClassJoin.get("name")),
                            "%" + filter.schoolClassName().toLowerCase() + "%"
                    ));
                }

                if (filter.rowNumber() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("rowNumber"), filter.rowNumber()));
                }
            }

            if (filter.status() != null)
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
