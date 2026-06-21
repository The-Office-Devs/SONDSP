package br.com.sondsp.controllers;

import br.com.sondsp.dtos.SchoolDTO;
import br.com.sondsp.filters.SchoolFilter;
import br.com.sondsp.form.SchoolForm;
import br.com.sondsp.services.SchoolService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> getSchoolsByfilter(@ModelAttribute SchoolFilter filter) {
        return ResponseEntity.ok().body(service.getSchools(filter).stream().map(SchoolDTO::new));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchool(@PathVariable Integer id, @Valid @RequestBody SchoolForm form) {
        return ResponseEntity.ok().body(new SchoolDTO(service.updateSchool(id, form)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchool(@PathVariable Integer id) {
        service.deleteSchool(id);
        return ResponseEntity.ok("Escola removida com sucesso.");
    }
}
