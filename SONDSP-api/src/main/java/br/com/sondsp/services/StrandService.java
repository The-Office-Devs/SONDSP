package br.com.sondsp.services;

import br.com.sondsp.repositories.StrandRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StrandService {
    private StrandRepository strandRepository;
}
