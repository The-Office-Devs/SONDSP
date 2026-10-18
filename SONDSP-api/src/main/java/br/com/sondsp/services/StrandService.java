package br.com.sondsp.services;

import static br.com.sondsp.util.SystemMessages.STRAND_NOT_FOUND;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.entities.Strand;
import br.com.sondsp.repositories.StrandRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StrandService {

	private final StrandRepository strandRepository;

	public Strand getStrand(Integer id) {
		return this.strandRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(STRAND_NOT_FOUND));
	}

	public List<StrandDTO> getAllStrandsBySubject(String subject) {
		if (subject == null) return Collections.emptyList();
		return this.strandRepository.findAllBySubjectAndStatusTrue(subject, true);
	}
}
