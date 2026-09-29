package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SchoolDTO;
import br.com.sondsp.entities.School;
import br.com.sondsp.filters.SchoolFilter;
import br.com.sondsp.form.SchoolForm;
import br.com.sondsp.services.SchoolService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.SCHOOL_ACTIVATED;
import static br.com.sondsp.util.SystemMessages.SCHOOL_DEACTIVATED;

@RestController
@RequestMapping("/school")
public class SchoolControllerImpl implements SchoolController {
    @Autowired
    private SchoolService service;

    @PostMapping()
    public ResponseEntity<?> createSchool(@Valid @RequestBody SchoolForm form) {
        return ResponseEntity.ok().body(new SchoolDTO(service.createSchool(form)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSchoolById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(new SchoolDTO(service.getSchool(id)));
    }

    @GetMapping()
    public ResponseEntity<PageResponse<SchoolDTO>> getSchoolsByfilter(
            @ModelAttribute SchoolFilter filter,
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "status", direction = Sort.Direction.DESC),
                    @SortDefault(sort = "name", direction = Sort.Direction.ASC, caseSensitive = false)
            }) Pageable pageable) {

        Page<School> schoolPage = service.getSchools(filter, pageable);

        List<SchoolDTO> contentDTO = schoolPage.getContent().stream()
                .map(SchoolDTO::new)
                .toList();

        PageResponse<SchoolDTO> response = new PageResponse<>(
                contentDTO,
                schoolPage.getNumber(),
                schoolPage.getSize(),
                schoolPage.getTotalElements(),
                schoolPage.getTotalPages(),
                schoolPage.hasNext(),
                schoolPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchool(@PathVariable Integer id, @Valid @RequestBody SchoolForm form) {
        return ResponseEntity.ok().body(new SchoolDTO(service.updateSchool(id, form)));
    }

    @PatchMapping("/{id}/changeStatus")
    public ResponseEntity<?> changeStatus(@PathVariable Integer id) {
        if (service.changeStatus(id))
            return ResponseEntity.ok(SCHOOL_ACTIVATED);

        return ResponseEntity.ok(SCHOOL_DEACTIVATED);
    }
}
