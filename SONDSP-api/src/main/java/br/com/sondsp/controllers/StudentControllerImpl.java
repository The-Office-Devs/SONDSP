package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.StudentDTO;
import br.com.sondsp.entities.Student;
import br.com.sondsp.filters.StudentFilter;
import br.com.sondsp.form.StudentForm;
import br.com.sondsp.services.StudentImportService;
import br.com.sondsp.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.STUDENT_ACTIVATED;
import static br.com.sondsp.util.SystemMessages.STUDENT_DEACTIVATED;

@RestController
@RequestMapping("/student")
public class StudentControllerImpl implements StudentController {

	@Autowired
	private StudentService service;

	@Autowired
	private StudentImportService importService;

	@PostMapping
	public ResponseEntity<?> createStudent(StudentForm form) {
		return ResponseEntity.ok().body(new StudentDTO(service.createStudent(form)));
	}

	@PostMapping("/load")
	public ResponseEntity<?> createStudents(List<StudentForm> forms) {
		return ResponseEntity.ok().body(service.createStudents(forms).stream().map(StudentDTO::new));
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getStudent(Integer id) {
		return ResponseEntity.ok().body(new StudentDTO(service.getStudent(id)));
	}

	@GetMapping
	public ResponseEntity<PageResponse<StudentDTO>> getStudents(StudentFilter filter, Pageable pageable) {
		Page<Student> studentPage = service.getStudents(filter, pageable);

		List<StudentDTO> contentDTO = studentPage.getContent().stream().map(StudentDTO::new).toList();

		PageResponse<StudentDTO> response = new PageResponse<>(
			contentDTO,
			studentPage.getNumber(),
			studentPage.getSize(),
			studentPage.getTotalElements(),
			studentPage.getTotalPages(),
			studentPage.hasNext(),
			studentPage.hasPrevious()
		);

		return ResponseEntity.ok().body(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateStudent(Integer id, StudentForm form) {
		return ResponseEntity.ok().body(new StudentDTO(service.updateStudent(id, form)));
	}

	@PatchMapping("/{id}/changeStatus")
	public ResponseEntity<?> changeStatus(Integer id) {
		if (service.changeStatus(id)) return ResponseEntity.ok(STUDENT_ACTIVATED);

		return ResponseEntity.ok(STUDENT_DEACTIVATED);
	}

	@PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> importStudents(MultipartFile file) {
		return ResponseEntity.ok().body(importService.importStudents(file));
	}
}
