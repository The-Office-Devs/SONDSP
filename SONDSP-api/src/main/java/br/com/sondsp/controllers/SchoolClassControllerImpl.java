package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SchoolClassDTO;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import br.com.sondsp.services.SchoolClassService;
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

import static br.com.sondsp.util.SystemMessages.SCHOOL_CLASS_ACTIVATED;
import static br.com.sondsp.util.SystemMessages.SCHOOL_CLASS_DEACTIVATED;

@RestController
@RequestMapping("/schoolClass")
public class SchoolClassControllerImpl implements SchoolClassController{
    @Autowired
    private SchoolClassService service;

    @PostMapping()
    public ResponseEntity<?> createSchoolClass(@Valid @RequestBody SchoolClassForm form) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.createSchoolClass(form)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSchoolClassById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.getSchoolClass(id)));
    }

    @GetMapping()
    public ResponseEntity<PageResponse<SchoolClassDTO>> getSchoolsClassesByFilter(
            @ModelAttribute SchoolClassFilter filter,
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "status", direction = Sort.Direction.DESC),
                    @SortDefault(sort = "schoolYear", direction = Sort.Direction.DESC),
                    @SortDefault(sort = "gradeLevel", direction = Sort.Direction.DESC),
                    @SortDefault(sort = "name", direction = Sort.Direction.ASC, caseSensitive = false),
            }) Pageable pageable) {

        Page<SchoolClass> schoolClassPage = service.getSchoolsClasses(filter, pageable);

        List<SchoolClassDTO> contentDTO = schoolClassPage.getContent().stream()
                .map(SchoolClassDTO::new)
                .toList();

        PageResponse<SchoolClassDTO> response = new PageResponse<>(
                contentDTO,
                schoolClassPage.getNumber(),
                schoolClassPage.getSize(),
                schoolClassPage.getTotalElements(),
                schoolClassPage.getTotalPages(),
                schoolClassPage.hasNext(),
                schoolClassPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchoolClass(@PathVariable Integer id, @RequestBody SchoolClassForm form) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.updateSchoolClass(id, form)));
    }

    @PatchMapping("/{id}/changeStatus")
    public ResponseEntity<?> changeStatus(@PathVariable Integer id) {
        if (service.changeStatus(id))
            return ResponseEntity.ok(SCHOOL_CLASS_ACTIVATED);

        return ResponseEntity.ok(SCHOOL_CLASS_DEACTIVATED);
    }
}
