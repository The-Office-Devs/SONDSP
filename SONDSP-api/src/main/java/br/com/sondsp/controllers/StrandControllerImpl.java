package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.filters.StrandFilter;
import br.com.sondsp.form.StrandForm;
import br.com.sondsp.services.StrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/strand")
public class StrandControllerImpl {

    @Autowired
    private StrandService strandService;

    @PostMapping()
    public ResponseEntity<StrandDTO> createStrand(@Valid @RequestBody StrandForm form) {
        return ResponseEntity.ok().body(new StrandDTO(strandService.createStrand(form)));
    }

    @PatchMapping("/{id}/changeStatus")
    public ResponseEntity<String> changeStrandStatus(@PathVariable Integer id) {
        return ResponseEntity.ok().body(strandService.changeStrandStatus(id));
    }

    @GetMapping()
    public ResponseEntity<Page<StrandDTO>> getAllStrand(
            @RequestParam(value = "search", required = false) String search,
            StrandFilter filter,
            Pageable pageable) {

        if (search != null && !search.trim().isEmpty()) {
            filter.setGeneralFilter(search.trim());
        }

        return ResponseEntity.ok().body(strandService.getAllStrands(filter, pageable));
    }
}