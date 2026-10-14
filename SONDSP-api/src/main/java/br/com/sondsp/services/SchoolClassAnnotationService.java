package br.com.sondsp.services;

import br.com.sondsp.entities.Role;
import br.com.sondsp.entities.SchoolClassAnnotation;
import br.com.sondsp.entities.SchoolClassAnnotationID;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.SchoolClassAnnotationFilter;
import br.com.sondsp.form.SchoolClassAnnotationForm;
import br.com.sondsp.repositories.SchoolClassAnnotationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    public Page<SchoolClassAnnotation> getAnnotations(Integer schoolClassId,
                                                      SchoolClassAnnotationFilter filter,
                                                      Pageable pageable) {
        return repository.findAll(buildFilter(schoolClassId, filter), pageable);
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

    private Specification<SchoolClassAnnotation> buildFilter(Integer schoolClassId,
                                                                   SchoolClassAnnotationFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("schoolClass").get("id"), schoolClassId));

            if (filter == null)
                return cb.and(predicates.toArray(new Predicate[0]));

            boolean hasRole = filter.authorRole() != null && !filter.authorRole().isBlank();
            boolean hasAuthorId = filter.authorId() != null;

            if (hasRole || hasAuthorId) {
                Join<SchoolClassAnnotation, User> authorJoin = root.join("author", JoinType.INNER);

                if (hasRole) {
                    Join<User, Role> roleJoin = authorJoin.join("role", JoinType.INNER);
                    predicates.add(cb.equal(roleJoin.get("name"), filter.authorRole()));
                }

                if (hasAuthorId)
                    predicates.add(cb.equal(authorJoin.get("id"), filter.authorId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
