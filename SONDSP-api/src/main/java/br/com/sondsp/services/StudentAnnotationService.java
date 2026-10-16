package br.com.sondsp.services;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.portfolio.StudentAnnotationDTO;
import br.com.sondsp.entities.Student;
import br.com.sondsp.entities.StudentAnnotation;
import br.com.sondsp.entities.User;
import br.com.sondsp.entities.enums.AnnotationTag;
import br.com.sondsp.form.StudentAnnotationForm;
import br.com.sondsp.form.UpdateAnnotationTagsForm;
import br.com.sondsp.repositories.StudentAnnotationRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.security.AuthenticationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

import static br.com.sondsp.util.SystemMessages.ANNOTATION_NOT_FOUND;
import static br.com.sondsp.util.SystemMessages.DIFFERENT_AUTHOR;
import static br.com.sondsp.util.SystemMessages.STUDENT_NOT_FOUND;
import static br.com.sondsp.util.SystemMessages.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class StudentAnnotationService {

    private final StudentAnnotationRepository annotationRepository;
    private final StudentRepository studentRepository;
    private final AuthenticationService authenticationService;

    @Transactional(readOnly = true)
    public PageResponse<StudentAnnotationDTO> getAnnotations(Integer studentId, AnnotationTag tag, Pageable pageable) {
        verifyStudentExists(studentId);
        Integer currentUserId = authenticationService.getCurrentUser().map(User::getId).orElse(null);

        Page<StudentAnnotation> page = (tag != null)
                ? annotationRepository.findAllByStudentIdAndTag(studentId, tag, pageable)
                : annotationRepository.findAllByStudentIdOrderByCreatedAtDesc(studentId, pageable);

        List<StudentAnnotationDTO> content = page.getContent().stream()
                .map(ann -> new StudentAnnotationDTO(ann, currentUserId))
                .toList();

        return new PageResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    @Transactional
    public StudentAnnotationDTO createAnnotation(Integer studentId, StudentAnnotationForm form) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException(STUDENT_NOT_FOUND));

        User author = authenticationService.getCurrentUser()
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        StudentAnnotation annotation = StudentAnnotation.builder()
                .student(student)
                .author(author)
                .text(form.text())
                .tags(form.tags() != null ? new HashSet<>(form.tags()) : new HashSet<>())
                .build();

        StudentAnnotation saved = annotationRepository.save(annotation);
        return new StudentAnnotationDTO(saved, author.getId());
    }

    @Transactional
    public StudentAnnotationDTO updateAnnotation(Integer studentId, Integer annotationId, StudentAnnotationForm form) {
        StudentAnnotation annotation = getAnnotationBelongingToStudent(studentId, annotationId);
        User currentUser = authenticationService.getCurrentUser()
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        if (!annotation.getAuthor().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException(DIFFERENT_AUTHOR);
        }

        annotation.setText(form.text());
        if (form.tags() != null) {
            annotation.setTags(new HashSet<>(form.tags()));
        }

        StudentAnnotation updated = annotationRepository.save(annotation);
        return new StudentAnnotationDTO(updated, currentUser.getId());
    }

    @Transactional
    public StudentAnnotationDTO updateAnnotationTags(Integer studentId, Integer annotationId, UpdateAnnotationTagsForm form) {
        StudentAnnotation annotation = getAnnotationBelongingToStudent(studentId, annotationId);
        User currentUser = authenticationService.getCurrentUser()
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        // Toggles de tags são permitidos a qualquer membro autenticado da equipe escolar para pautas de conselho
        annotation.setTags(new HashSet<>(form.tags()));

        StudentAnnotation updated = annotationRepository.save(annotation);
        return new StudentAnnotationDTO(updated, currentUser.getId());
    }

    @Transactional
    public void deleteAnnotation(Integer studentId, Integer annotationId) {
        StudentAnnotation annotation = getAnnotationBelongingToStudent(studentId, annotationId);
        User currentUser = authenticationService.getCurrentUser()
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        if (!annotation.getAuthor().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException(DIFFERENT_AUTHOR);
        }

        annotationRepository.delete(annotation);
    }

    private StudentAnnotation getAnnotationBelongingToStudent(Integer studentId, Integer annotationId) {
        StudentAnnotation annotation = annotationRepository.findById(annotationId)
                .orElseThrow(() -> new EntityNotFoundException(ANNOTATION_NOT_FOUND));

        if (!annotation.getStudent().getId().equals(studentId)) {
            throw new EntityNotFoundException(ANNOTATION_NOT_FOUND);
        }

        return annotation;
    }

    private void verifyStudentExists(Integer studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new EntityNotFoundException(STUDENT_NOT_FOUND);
        }
    }
}
