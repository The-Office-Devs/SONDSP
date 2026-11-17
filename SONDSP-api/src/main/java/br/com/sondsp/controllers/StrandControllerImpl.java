package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.services.StrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/strand")
public class StrandControllerImpl implements StrandController {

	@Autowired
	private StrandService strandService;

	@Override
	@GetMapping("/{id}")
	public ResponseEntity<StrandDTO> getStrand(Integer id) {
		return ResponseEntity.ok(new StrandDTO(strandService.getStrand(id)));
	}

	@Override
	@GetMapping("strands-by-subject")
	public ResponseEntity<List<StrandDTO>> findBySubject(String subject) {
		return ResponseEntity.ok().body(strandService.getAllStrandsBySubject(subject));
	}
}
