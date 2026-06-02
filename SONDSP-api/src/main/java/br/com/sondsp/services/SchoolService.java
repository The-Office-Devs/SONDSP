package br.com.sondsp.services;

import br.com.sondsp.entities.School;
import br.com.sondsp.form.SchoolForm;
import br.com.sondsp.repositories.SchoolRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
public class SchoolService {
    private SchoolRepository schoolRepository;

    public ResponseEntity<?> createSchool(SchoolForm school) {
        return school.name().isBlank() ? ResponseEntity.badRequest().body("Deve ser passado um nome para a escola.") :
                new ResponseEntity<>(schoolRepository.save(new School(school.name())), HttpStatus.OK);
    }

    public ResponseEntity<?> getSchoolsByName(String name) { return ResponseEntity.ok(schoolRepository.getByNameContaining(name)); }

    public ResponseEntity<?> getAllSchools() { return ResponseEntity.ok(schoolRepository.findAll()); }

    public ResponseEntity<?> updateSchool(Integer id, SchoolForm school) {
        try {
            School updatedSchool = schoolRepository.save(School.updateSchoolWithSchoolForm(getSchoolById(id), school));

            return ResponseEntity.ok("Escola " + updatedSchool.getName());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private School getSchoolById(Integer id) {
        return schoolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "School not found"));
    }
}
