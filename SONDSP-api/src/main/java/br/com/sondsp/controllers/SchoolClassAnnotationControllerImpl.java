package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SchoolClassAnnotationDTO;
import br.com.sondsp.entities.SchoolClassAnnotation;
import br.com.sondsp.filters.SchoolClassAnnotationFilter;
import br.com.sondsp.form.SchoolClassAnnotationForm;
import br.com.sondsp.services.SchoolClassAnnotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

import static br.com.sondsp.util.SystemMessages.DELETED_ANNOTATION;

@RestController
@RequestMapping("/schoolClass/{schoolClassId}/annotations")
public class SchoolClassAnnotationControllerImpl implements SchoolClassAnnotationController {

	@Autowired
	private SchoolClassAnnotationService service;

	@GetMapping("/{annotationId}")
	@PreAuthorize("hasAuthority('TURMA_VIEW')")
	public ResponseEntity<?> getAnnotation(Integer schoolClassId, Integer annotationId) {
		return ResponseEntity
			.ok()
			.body(new SchoolClassAnnotationDTO(service.getAnnotation(schoolClassId, annotationId)));
	}

	@GetMapping
	@PreAuthorize("hasAuthority('TURMA_VIEW')")
	public ResponseEntity<?> getAnnotations(
		Integer schoolClassId,
		SchoolClassAnnotationFilter filter,
		Pageable pageable
	) {
		Page<SchoolClassAnnotation> schoolClassAnnotationPage = service.getAnnotations(schoolClassId, filter, pageable);

		List<SchoolClassAnnotationDTO> contentDTO = schoolClassAnnotationPage
			.getContent()
			.stream()
			.map(SchoolClassAnnotationDTO::new)
			.toList();

		PageResponse<SchoolClassAnnotationDTO> response = new PageResponse<>(
			contentDTO,
			schoolClassAnnotationPage.getNumber(),
			schoolClassAnnotationPage.getSize(),
			schoolClassAnnotationPage.getTotalElements(),
			schoolClassAnnotationPage.getTotalPages(),
			schoolClassAnnotationPage.hasNext(),
			schoolClassAnnotationPage.hasPrevious()
		);

		return ResponseEntity.ok().body(response);
	}

	@PostMapping
	@PreAuthorize("hasAuthority('TURMA_ANOTACOES_MANAGE')")
	public ResponseEntity<?> createAnnotation(Integer schoolClassId, SchoolClassAnnotationForm form) {
		return ResponseEntity.ok().body(new SchoolClassAnnotationDTO(service.createAnnotation(schoolClassId, form)));
	}

	@PutMapping("/{annotationId}")
	@PreAuthorize("hasAuthority('TURMA_ANOTACOES_MANAGE')")
	public ResponseEntity<?> updateAnnotation(
		Integer schoolClassId,
		Integer annotationId,
		SchoolClassAnnotationForm form
	) throws AccessDeniedException {
		return ResponseEntity
			.ok()
			.body(new SchoolClassAnnotationDTO(service.updateAnnotation(schoolClassId, annotationId, form)));
	}

	@DeleteMapping("/{annotationId}")
	@PreAuthorize("hasAuthority('TURMA_ANOTACOES_MANAGE')")
	public ResponseEntity<?> deleteAnnotation(Integer schoolClassId, Integer annotationId)
		throws AccessDeniedException {
		service.deleteAnnotation(schoolClassId, annotationId);
		return ResponseEntity.ok(DELETED_ANNOTATION);
	}
}
