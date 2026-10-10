package br.com.sondsp.services;

import br.com.sondsp.entities.SchoolClassAnnotation;
import br.com.sondsp.entities.SchoolClassAnnotationID;
import br.com.sondsp.entities.User;
import br.com.sondsp.form.SchoolClassAnnotationForm;
import br.com.sondsp.repositories.SchoolClassAnnotationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;

import static br.com.sondsp.util.SystemMessages.ANNOTATION_NOT_FOUND;
import static br.com.sondsp.util.SystemMessages.DIFFERENT_AUTHOR;

@Service
@AllArgsConstructor
public class SchoolClassAnnotationService {
    @Autowired
    private SchoolClassAnnotationRepository repository;

    @Autowired
    private SchoolClassService schoolClassService;

    public SchoolClassAnnotation getAnnotation(Integer schoolClassId, Integer annotationId) {
        SchoolClassAnnotationID id = new SchoolClassAnnotationID(schoolClassId, annotationId);
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(ANNOTATION_NOT_FOUND));
    }

    public Page<SchoolClassAnnotation> getAnnotations(Integer schoolClassId, Pageable pageable) {
        return repository.findAllBySchoolClassId(schoolClassId, pageable);
    }

    public SchoolClassAnnotation createAnnotation(Integer schoolClassId, SchoolClassAnnotationForm form) {
        User requestUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Integer nextId = repository.findMaxIdBySchoolClassId(schoolClassId).orElse(0) + 1;

        SchoolClassAnnotationID embeddedId = new SchoolClassAnnotationID(schoolClassId, nextId);

        return repository.save(SchoolClassAnnotation.builder()
                .id(embeddedId)
                .schoolClass(schoolClassService.getSchoolClass(schoolClassId))
                .author(requestUser)
                .annotationText(form.text())
                .creationDate(LocalDateTime.now())
                .build());
    }

    public SchoolClassAnnotation updateAnnotation(Integer schoolClassId, Integer annotationId, SchoolClassAnnotationForm form) throws AccessDeniedException {
        SchoolClassAnnotation annotation = getAnnotation(schoolClassId, annotationId);

        checkAuthor(annotation);
        annotation.setAnnotationText(form.text());

        return repository.save(annotation);
    }

    public void deleteAnnotation(Integer schoolClassId, Integer annotationId) throws AccessDeniedException {
        SchoolClassAnnotation annotation = getAnnotation(schoolClassId, annotationId);
        checkAuthor(annotation);

        repository.delete(annotation);
    }

    private void checkAuthor(SchoolClassAnnotation annotation) throws AccessDeniedException {
        User requestUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (requestUser == null  || !annotation.getAuthor().getId().equals(requestUser.getId()))
            throw new AccessDeniedException(DIFFERENT_AUTHOR);
    }
}
