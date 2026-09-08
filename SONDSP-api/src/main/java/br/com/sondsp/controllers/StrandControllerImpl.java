package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.entities.Strand;
import br.com.sondsp.filters.StrandFilter;
import br.com.sondsp.form.StrandForm;
import br.com.sondsp.services.StrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.STRAND_ACTIVATED;
import static br.com.sondsp.util.SystemMessages.STRAND_DEACTIVATED;

@RestController
@RequestMapping("/strand")
public class StrandControllerImpl {

    @Autowired
    private StrandService strandService;

    @PostMapping()
    public ResponseEntity<StrandDTO> createStrand(@Valid @RequestBody StrandForm form) throws Exception {
        return ResponseEntity.ok().body(new StrandDTO(strandService.createStrand(form)));
    }

    @PatchMapping("/{id}/changeStatus")
    public ResponseEntity<?> changeStrandStatus(@PathVariable Integer id) {
        if (strandService.changeStrandStatus(id))
            return ResponseEntity.ok(STRAND_ACTIVATED);

        return ResponseEntity.ok(STRAND_DEACTIVATED);
    }

    @GetMapping()
    public ResponseEntity<PageResponse<StrandDTO>> getAllStrand(
            @ModelAttribute StrandFilter filter,
            @PageableDefault(size = 5, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {

        Page<Strand> strandsPage = strandService.getAllStrands(filter, pageable);

        List<StrandDTO> contentDTO = strandsPage.getContent().stream()
                .map(StrandDTO::new)
                .toList();

        PageResponse<StrandDTO> response = new PageResponse<>(
                contentDTO,
                strandsPage.getNumber(),
                strandsPage.getSize(),
                strandsPage.getTotalElements(),
                strandsPage.getTotalPages(),
                strandsPage.hasNext(),
                strandsPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }
}