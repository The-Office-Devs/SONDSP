package br.com.sondsp.services;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.entities.Strand;
import br.com.sondsp.form.StrandForm;
import br.com.sondsp.repositories.StrandRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import static br.com.sondsp.util.SystemMessages.STRAND_NOT_FOUND;

@Service
@AllArgsConstructor
public class StrandService {
    private StrandRepository strandRepository;

    public Strand createStrand(StrandForm form) {
        Strand strand = Strand
                .builder()
                .name(form.name())
                .subject(form.subject())
                .status(true)
                .build();

        return strandRepository.save(strand);
    }

    public String changeStrandStatus(Integer id) {
        Strand strand = this.strandRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(STRAND_NOT_FOUND)
        );

        strand.setStatus(!strand.getStatus());
        strandRepository.save(strand);

        return "Status alterado com sucesso";
    }

    public Page<StrandDTO> getAllStrands(String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return this.strandRepository.findByNameContainingIgnoreCase(search.trim(), pageable);
        }

        return this.strandRepository.findAllBy(pageable);
    }
}