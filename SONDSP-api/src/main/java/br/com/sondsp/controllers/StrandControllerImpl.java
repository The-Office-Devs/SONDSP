package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.services.StrandService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/strand")
public class StrandControllerImpl implements StrandController {

	@Autowired
	private StrandService strandService;

	@Override
	@GetMapping("/{id}")
	public ResponseEntity<StrandDTO> getStrand(@PathVariable Integer id) {
		return ResponseEntity.ok(new StrandDTO(strandService.getStrand(id)));
	}

	@Override
	@GetMapping("strands-by-subject")
	public ResponseEntity<List<StrandDTO>> findBySubject(@RequestParam String subject) {
		return ResponseEntity.ok().body(strandService.getAllStrandsBySubject(subject));
	}
}
