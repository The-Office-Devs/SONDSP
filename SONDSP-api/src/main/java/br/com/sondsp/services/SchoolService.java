package br.com.sondsp.services;

import br.com.sondsp.entities.School;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.exceptions.SchoolAlreadyExistsException;
import br.com.sondsp.filters.SchoolFilter;
import br.com.sondsp.form.SchoolForm;
import br.com.sondsp.repositories.SchoolClassRepository;
import br.com.sondsp.repositories.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
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
public class SchoolService {
    private SchoolRepository repository;
    private SchoolClassRepository schoolClassRepository;

    public School createSchool(SchoolForm form) {
        if (repository.existsByCodigoInep(form.codigoInep())) {
            throw new SchoolAlreadyExistsException(INEP_ALREADY_EXISTS);
        }

        return repository.save(School.builder()
                .name(form.name())
                .codigoInep(form.codigoInep())
                .status(true)
                .build());
    }

    public School getSchool(Integer id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(SCHOOL_NOT_FOUND));
    }

    public Page<School> getSchools(SchoolFilter filter, Pageable pageable) {
        Specification<School> spec = buildFilter(filter);
        return repository.findAll(spec, pageable);
    }

    public School updateSchool(Integer id, SchoolForm form) {
        School school = getSchool(id);

        if (repository.existsByCodigoInepAndIdNot(form.codigoInep(), id)) {
            throw new SchoolAlreadyExistsException(INEP_ALREADY_EXISTS);
        }

        school.setName(form.name());
        school.setCodigoInep(form.codigoInep());

        return repository.save(school);
    }

    public boolean changeStatus(Integer id) {
        School school = getSchool(id);

        // Se a escola estiver ativa, valida se existe alguma turma ativa relacionada
        if (school.getStatus()) {
            List<SchoolClass> classes = schoolClassRepository.findAllBySchoolId(id);

            if (classes.stream().anyMatch(SchoolClass::getStatus))
                throw new ValidationException(SCHOOL_CANNOT_INACTIVATE);
        }

        school.setStatus(!school.getStatus());
        repository.save(school);

        return school.getStatus();
    }

    private Specification<School> buildFilter(SchoolFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null)
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

            if (filter.search() != null && !filter.search().isBlank()) {
                String search = filter.search().toLowerCase();
                String searchPattern = "%" + search + "%";

                List<Predicate> orPredicates = new ArrayList<>();
                orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern));
                orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("codigoInep")), searchPattern));

                Boolean status = null;
                if ("ativo".startsWith(search)) {
                    status = true;
                } else if ("inativo".startsWith(search)) {
                    status = false;
                }

                if (status != null)
                    orPredicates.add(criteriaBuilder.equal(root.get("status"), status));

                predicates.add(criteriaBuilder.or(orPredicates.toArray(new Predicate[0])));
            } else {
                if (filter.name() != null && !filter.name().isBlank()) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));
                }
            }

            if (filter.status() != null)
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
