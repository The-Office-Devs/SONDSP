package br.com.sondsp.services;

import br.com.sondsp.entities.Strand;
import br.com.sondsp.form.StrandForm;
import br.com.sondsp.repositories.StrandRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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
}
