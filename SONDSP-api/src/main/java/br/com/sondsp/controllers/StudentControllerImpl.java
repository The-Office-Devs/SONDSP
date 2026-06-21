package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StudentDTO;
import br.com.sondsp.filters.StudentFilter;
import br.com.sondsp.form.StudentForm;
import br.com.sondsp.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentControllerImpl implements StudentController {
    @Autowired
    private StudentService service;

    @PostMapping()
    public ResponseEntity<?> createStudent(@RequestBody StudentForm form) {
        return ResponseEntity.ok().body(new StudentDTO(service.createStudent(form)));
    }

    @PostMapping("/load")
    public ResponseEntity<?> createStudents(@RequestBody List<StudentForm> forms) {
        return ResponseEntity.ok().body(service.createStudents(forms).stream().map(StudentDTO::new));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@RequestParam Integer id) {
        return ResponseEntity.ok().body(new StudentDTO(service.getStudent(id)));
    }

    @GetMapping()
    public ResponseEntity<?> getStudents(@ModelAttribute StudentFilter filter) {
        return ResponseEntity.ok().body(service.getStudents(filter).stream().map(StudentDTO::new));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@RequestParam Integer id, @RequestBody StudentForm form) {
        return ResponseEntity.ok().body(new StudentDTO(service.updateStudent(id, form)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@RequestParam Integer id) {
        service.deleteStudent(id);
        return ResponseEntity.ok("Aluno desativado com sucesso.");
    }
}
