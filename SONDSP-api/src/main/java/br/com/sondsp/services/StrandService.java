package br.com.sondsp.services;

import br.com.sondsp.entities.Strand;
import br.com.sondsp.filters.StrandFilter;
import br.com.sondsp.form.StrandForm;
import br.com.sondsp.repositories.StrandRepository;
import br.com.sondsp.util.SpecificationFilter;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static br.com.sondsp.util.SystemMessages.EMPTY_DATA;
import static br.com.sondsp.util.SystemMessages.STRAND_NOT_FOUND;

@Service
@AllArgsConstructor
public class StrandService {

    private final StrandRepository strandRepository;
    private final SpecificationFilter specificationFilter;

    public Strand createStrand(StrandForm form) throws Exception {
        if(!this.validateStrand(form)) throw new Exception(EMPTY_DATA);

        Strand strand = Strand
                .builder()
                .name(form.name())
                .subject(form.subject())
                .status(true)
                .build();

        return strandRepository.save(strand);
    }

    public boolean changeStrandStatus(Integer id) {
        Strand strand = this.getStrand(id);
        strand.setStatus(!strand.getStatus());
        strandRepository.save(strand);
        return strand.getStatus();
    }

    public Page<Strand> getAllStrands(StrandFilter filter, Pageable pageable) {
        Specification<Strand> spec = buildFilter(filter);
        return strandRepository.findAll(spec, pageable);
    }

    private Strand getStrand(Integer id) {
        return this.strandRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(STRAND_NOT_FOUND)
        );
    }

    private boolean validateStrand(StrandForm form) {
        return form.name() != null && form.subject() != null;
    }

    private Specification<Strand> buildFilter(StrandFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null)
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

            if (filter.search() != null && !filter.search().isBlank()) {
                String search = filter.search().toLowerCase();
                String searchPattern = "%" + search + "%";

                List<Predicate> orPredicates = new ArrayList<>();
                orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern));
                orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("subject")), searchPattern));

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
                if (filter.name() != null && !filter.name().isBlank())
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));

                if (filter.subject() != null && !filter.subject().isBlank())
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("subject")), "%" + filter.subject().toLowerCase() + "%"));

            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}