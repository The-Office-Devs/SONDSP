package br.com.sondsp.controllers;

import br.com.sondsp.dtos.SchoolClassDTO;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import br.com.sondsp.services.SchoolClassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> getSchoolClassById(@RequestParam Integer id) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.getSchoolClass(id)));
    }

    @GetMapping()
    public ResponseEntity<?> getSchoolsClassesByFilter(@ModelAttribute SchoolClassFilter filter) {
        return ResponseEntity.ok().body(service.getSchoolsClasses(filter).stream().map(SchoolClassDTO::new));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchoolClass(@RequestParam Integer id, @RequestBody SchoolClassForm form) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.updateSchoolClass(id, form)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchoolClass(@RequestParam Integer id) {
        service.deleteSchoolClass(id);
        return ResponseEntity.ok("Turma desativada com sucesso.");
    }
}
