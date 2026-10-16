package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.portfolio.StudentAnnotationDTO;
import br.com.sondsp.dtos.portfolio.StudentPortfolioDTO;
import br.com.sondsp.dtos.portfolio.TimelineItemDTO;
import br.com.sondsp.entities.enums.AnnotationTag;
import br.com.sondsp.form.StudentAnnotationForm;
import br.com.sondsp.form.UpdateAnnotationTagsForm;
import br.com.sondsp.services.StudentAnnotationService;
import br.com.sondsp.services.StudentPortfolioService;
import br.com.sondsp.services.StudentTimelineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.DELETED_ANNOTATION;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentPortfolioControllerImpl implements StudentPortfolioController {

    private final StudentPortfolioService portfolioService;
    private final StudentTimelineService timelineService;
    private final StudentAnnotationService annotationService;

    @Override
    @GetMapping("/{id}/portfolio")
    public ResponseEntity<StudentPortfolioDTO> getStudentPortfolio(@PathVariable Integer id) {
        return ResponseEntity.ok(portfolioService.getStudentPortfolio(id));
    }

    @Override
    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<TimelineItemDTO>> getStudentTimeline(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer strandId
    ) {
        return ResponseEntity.ok(timelineService.getStudentTimeline(id, strandId));
    }

    @Override
    @GetMapping("/{id}/annotations")
    public ResponseEntity<PageResponse<StudentAnnotationDTO>> getStudentAnnotations(
            @PathVariable Integer id,
            @RequestParam(required = false) AnnotationTag tag,
            @SortDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(annotationService.getAnnotations(id, tag, pageable));
    }

    @Override
    @PostMapping("/{id}/annotations")
    public ResponseEntity<StudentAnnotationDTO> createAnnotation(
            @PathVariable Integer id,
            @Valid @RequestBody StudentAnnotationForm form
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(annotationService.createAnnotation(id, form));
    }

    @Override
    @PutMapping("/{id}/annotations/{annotationId}")
    public ResponseEntity<StudentAnnotationDTO> updateAnnotation(
            @PathVariable Integer id,
            @PathVariable Integer annotationId,
            @Valid @RequestBody StudentAnnotationForm form
    ) {
        return ResponseEntity.ok(annotationService.updateAnnotation(id, annotationId, form));
    }

    @Override
    @PatchMapping("/{id}/annotations/{annotationId}/tags")
    public ResponseEntity<StudentAnnotationDTO> updateAnnotationTags(
            @PathVariable Integer id,
            @PathVariable Integer annotationId,
            @Valid @RequestBody UpdateAnnotationTagsForm form
    ) {
        return ResponseEntity.ok(annotationService.updateAnnotationTags(id, annotationId, form));
    }

    @Override
    @DeleteMapping("/{id}/annotations/{annotationId}")
    public ResponseEntity<?> deleteAnnotation(
            @PathVariable Integer id,
            @PathVariable Integer annotationId
    ) {
        annotationService.deleteAnnotation(id, annotationId);
        return ResponseEntity.ok(DELETED_ANNOTATION);
    }
}
