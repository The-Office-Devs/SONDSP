package br.com.sondsp.controllers;

import br.com.sondsp.dtos.SchoolDTO;
import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.form.StrandForm;
import br.com.sondsp.services.StrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/strand")
public class StrandControllerImpl {
    @Autowired
    private StrandService strandService;

    @PostMapping()
    public ResponseEntity<?> createStrand(@Valid @RequestBody StrandForm form) {
        return ResponseEntity.ok().body(new StrandDTO(strandService.createStrand(form)));
    }
}
