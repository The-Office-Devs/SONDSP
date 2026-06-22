package br.com.sondsp.services;

import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.entities.Student;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.StudentFilter;
import br.com.sondsp.form.StudentForm;
import br.com.sondsp.repositories.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
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
import java.util.Objects;

import static br.com.sondsp.util.SystemMessages.ROW_NUMBER_TAKEN;
import static br.com.sondsp.util.SystemMessages.STUDENT_NOT_FOUND;

@Service
@AllArgsConstructor
public class StudentService {
    private StudentRepository repository;
    private SchoolClassService schoolClassService;

    public Student createStudent(StudentForm form) {
        return repository.save(Student.builder()
                .name(form.name())
                .registration(form.registration())
                .schoolClass(form.schoolClassId() != null ? schoolClassService.getSchoolClass(form.schoolClassId()) : null)
                .rowNumber(form.schoolClassId() != null ? null : form.rowNumber())
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

        if (student.getSchoolClass() != null && !Objects.equals(student.getSchoolClass().getId(), form.schoolClassId())) {
            student.setSchoolClass(schoolClassService.getSchoolClass(form.schoolClassId()));

            for (Student verifyStudent : repository.findAllBySchoolClassId(form.schoolClassId())) {
                if (Objects.equals(verifyStudent.getRowNumber(), form.rowNumber()))
                    throw new ValidationException(ROW_NUMBER_TAKEN);
            }
        }

        student.setName(form.name());
        student.setRegistration(form.registration());
        student.setRowNumber(form.rowNumber());

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

                String searchPattern = "%" + filter.search().toLowerCase() + "%";

                Predicate searchInName = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern);
                Predicate searchInRegistration = criteriaBuilder.like(criteriaBuilder.lower(root.get("registration")), searchPattern);
                Predicate searchInSchoolClass = criteriaBuilder.like(criteriaBuilder.lower(schoolClassJoin.get("name")), searchPattern);

                Predicate combinedSearchPredicate = criteriaBuilder.or(searchInName, searchInRegistration, searchInSchoolClass);

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
