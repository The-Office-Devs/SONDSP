package br.com.sondsp.services;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.entities.Strand;
import br.com.sondsp.form.StrandForm;
import br.com.sondsp.repositories.StrandRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public Strand deleteStrand(Integer id) {
        Strand strand = this.strandRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(STRAND_NOT_FOUND)
        );

        strand.setStatus(false);
        return strandRepository.save(strand);
    }

    public List<StrandDTO> getAllStrands() {
        return this.strandRepository.findAllByStatus(true);
    }
}
