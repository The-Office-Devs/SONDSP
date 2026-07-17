package br.com.sondsp.services;

import br.com.sondsp.entities.School;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import br.com.sondsp.repositories.SchoolClassRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static br.com.sondsp.util.SystemMessages.SCHOOL_CLASS_NOT_FOUND;

@Service
@AllArgsConstructor
public class SchoolClassService {
    private SchoolClassRepository repository;
    private SchoolService schoolService;

    public SchoolClass createSchoolClass(SchoolClassForm form) {
        return repository.save(new SchoolClass(form, schoolService.getSchool(form.schoolId())));
    }

    public SchoolClass getSchoolClass(Integer id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(SCHOOL_CLASS_NOT_FOUND));
    }

    public Page<SchoolClass> getSchoolsClasses(SchoolClassFilter filter, Pageable pageable) {
        Specification<SchoolClass> spec = buildFilter(filter);
        return repository.findAll(spec, pageable);
    }

    public SchoolClass updateSchoolClass(Integer id, SchoolClassForm form) {
        return repository.save(SchoolClass.updateSchoolClassWithForm(getSchoolClass(id), form));
    }

    public void deleteSchoolClass(Integer id) {
        SchoolClass schoolClass = getSchoolClass(id);
        schoolClass.setStatus(false);
        repository.save(schoolClass);
    }

    private Specification<SchoolClass> buildFilter(SchoolClassFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null)
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

            if (filter.search() != null && !filter.search().isBlank()) {
                Join<SchoolClass, School> schoolJoin = root.join("school", JoinType.INNER);

                String searchPattern = "%" + filter.search().toLowerCase() + "%";

                Predicate searchInSchool = criteriaBuilder.like(criteriaBuilder.lower(schoolJoin.get("name")), searchPattern);
                Predicate searchInName = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern);
                Predicate searchInSchoolYear = criteriaBuilder.like(criteriaBuilder.lower(root.get("schoolYear")), searchPattern);

                Predicate combinedSearchPredicate = criteriaBuilder.or(searchInSchool, searchInName, searchInSchoolYear);

                predicates.add(combinedSearchPredicate);
            } else {
                if (filter.schoolName() != null && !filter.schoolName().isBlank()) {
                    Join<SchoolClass, School> schoolJoin = root.join("school", JoinType.INNER);

                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(schoolJoin.get("name")), "%" + filter.schoolName().toLowerCase() + "%"));
                }

                if (filter.name() != null && !filter.name().isBlank()) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));
                }

                if (filter.schoolYear() != null && !filter.schoolYear().isBlank()) {
                    predicates.add(criteriaBuilder.equal(root.get("schoolYear"), filter.schoolYear()));
                }
            }

            if (filter.status() != null)
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
