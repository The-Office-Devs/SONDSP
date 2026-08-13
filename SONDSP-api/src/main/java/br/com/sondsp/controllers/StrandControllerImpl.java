package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.form.StrandForm;
import br.com.sondsp.services.StrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/strand")
public class StrandControllerImpl {
    @Autowired
    private StrandService strandService;

    @PostMapping()
    public ResponseEntity<?> createStrand(@Valid @RequestBody StrandForm form) {
        return ResponseEntity.ok().body(new StrandDTO(strandService.createStrand(form)));
    }

    @PutMapping()
    public ResponseEntity<?> deleteStrand(@Valid @RequestBody Integer idStrand) {
        return ResponseEntity.ok().body(new StrandDTO(strandService.deleteStrand(idStrand)));
    }

    @GetMapping()
    public ResponseEntity<List<StrandDTO>> getAllStrand() {
        return ResponseEntity.ok().body(strandService.getAllStrands());
    }
}
