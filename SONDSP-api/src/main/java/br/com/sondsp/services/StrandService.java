package br.com.sondsp.services;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.entities.Strand;
import br.com.sondsp.filters.StrandFilter;
import br.com.sondsp.form.StrandForm;
import br.com.sondsp.repositories.StrandRepository;
import br.com.sondsp.util.SpecificationFilter;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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

    public Strand changeStrandStatus(Integer id) {
        Strand strand = this.getStrand(id);
        strand.setStatus(!strand.getStatus());
        return strandRepository.save(strand);
    }

    public Page<StrandDTO> getAllStrands(StrandFilter filter, Pageable pageable) {
        List<SpecificationFilter.FilterColumn> columnsConfig = List.of(
                new SpecificationFilter.FilterColumn("name", "name"),
                new SpecificationFilter.FilterColumn("subject", "subject"),
                new SpecificationFilter.FilterColumn("status", "status")
        );

        Specification<Strand> spec = specificationFilter.buildFilter(filter, columnsConfig);
        Page<Strand> strandsPage = strandRepository.findAll(spec, pageable);

        return strandsPage.map(StrandDTO::new);
    }

    private Strand getStrand(Integer id) {
        return this.strandRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(STRAND_NOT_FOUND)
        );
    }

    private boolean validateStrand(StrandForm form) {
        return form.name() != null && form.subject() != null;
    }
}