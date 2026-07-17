package br.com.sondsp.services;

import br.com.sondsp.entities.School;
import br.com.sondsp.filters.SchoolFilter;
import br.com.sondsp.form.SchoolForm;
import br.com.sondsp.repositories.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static br.com.sondsp.util.SystemMessages.SCHOOL_NOT_FOUND;

@Service
@AllArgsConstructor
public class SchoolService {
    private SchoolRepository repository;

    public School createSchool(SchoolForm school) {
        return repository.save(new School(school));
    }

    public School getSchool(Integer id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(SCHOOL_NOT_FOUND));
    }

    public Page<School> getSchools(SchoolFilter filter, Pageable pageable) {
        Specification<School> spec = buildFilter(filter);
        return repository.findAll(spec, pageable);
    }

    public School updateSchool(Integer id, SchoolForm school) {
        return repository.save(School.updateSchoolWithSchoolForm(getSchool(id), school));
    }

    public void deleteSchool(Integer id) {
        School school = getSchool(id);
        school.setStatus(false);
        repository.save(school);
    }

    private Specification<School> buildFilter(SchoolFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null)
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

            if (filter.search() != null && !filter.search().isBlank()) {
                String searchPattern = "%" + filter.search().toLowerCase() + "%";

                Predicate searchInName = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern);
                Predicate searchInPrincipal = criteriaBuilder.like(criteriaBuilder.lower(root.get("principalName")), searchPattern);

                Predicate combinedSearchPredicate = criteriaBuilder.or(searchInName, searchInPrincipal);

                predicates.add(combinedSearchPredicate);
            } else {
                if (filter.name() != null && !filter.name().isBlank()) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));
                }

                if (filter.principalName() != null && !filter.principalName().isBlank()) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("principalName")), "%" + filter.principalName().toLowerCase() + "%"));
                }
            }

            if (filter.status() != null)
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
