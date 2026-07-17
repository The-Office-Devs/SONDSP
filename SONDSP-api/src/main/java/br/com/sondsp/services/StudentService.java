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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

import static br.com.sondsp.util.SystemMessages.STUDENT_NOT_FOUND;

@Controller
public class StudentService {
    private StudentRepository repository;
    private SchoolClassService schoolClassService;

    public Student createStudent(StudentForm form) {
        return repository.save(new Student(form));
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
        SchoolClass schoolClass = schoolClassService.getSchoolClass(form.schoolClassId());
        return repository.save(Student.updateStudentWithForm(form, student, schoolClass));
    }

    public void deleteStudent(Integer id) {
        Student student = getStudent(id);
        student.setStatus(false);
        repository.save(student);
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
