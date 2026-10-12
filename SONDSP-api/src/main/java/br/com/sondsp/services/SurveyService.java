package br.com.sondsp.services;

import br.com.sondsp.entities.*;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import br.com.sondsp.repositories.ActivityRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.repositories.SurveyRepository;
import br.com.sondsp.util.SpecificationFilter;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.xml.bind.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static br.com.sondsp.util.SystemConstants.IMAGE_URL_EXPIRATION_TIME;
import static br.com.sondsp.util.SystemMessages.*;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final StudentRepository studentRepository;
    private final ActivityRepository activityRepository;
    private final SupabaseStorageService storageService;

    @Autowired
    private SpecificationFilter specificationFilter;

    public Survey createSurvey(SurveyForm form, User administrator) throws IOException {
        Student student = findStudentById(form.studentId());
        Activity activity = findActivityById(form.activityModelId());
        Survey survey = new Survey(form, administrator, student, activity);

        if (form.image() != null && !form.image().isEmpty()) {
            String savedImagePath = storageService.uploadImage(form.image());
            survey.setSurveyImagePath(savedImagePath);
        }

        return surveyRepository.save(survey);
    }

    public Survey updateSurvey(Integer id, SurveyForm form) throws IOException {
        Survey survey = findSurveyById(id);
        survey.setResult(form.result());
        survey.setNotes(form.notes());
        survey.setStatus(true);

        if (form.image() != null && !form.image().isEmpty()) {
            String savedImagePath = storageService.uploadImage(form.image());
            survey.setSurveyImagePath(savedImagePath);
        }

        return surveyRepository.save(survey);
    }

    public void deleteSurvey(Integer id) throws ValidationException {
        Survey survey = findSurveyById(id);
        if (survey.getStatus().equals(false) && !StringUtils.hasText(survey.getSurveyImagePath()) && !StringUtils.hasText(survey.getResult())) {
            surveyRepository.delete(survey);
        } else {
            throw new ValidationException(SURVEY_CANNOT_DELETE);
        }
    }

    private Survey findSurveyById(Integer id){
        return this.surveyRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(SURVEY_NOT_FOUND)
        );
    }

    private Student findStudentById(Integer id){
        return this.studentRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(STUDENT_NOT_FOUND)
        );
    }

    private Activity findActivityById(Integer id){
        return this.activityRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(ACTIVITY_NOT_FOUND)
        );
    }

    public List<Survey> listSurveys(SurveyFilter filter){
        List<SpecificationFilter.FilterColumn> columnsConfig = List.of(
                new SpecificationFilter.FilterColumn("result", "result"),
                new SpecificationFilter.FilterColumn("isDigital", "isDigital"),
                new SpecificationFilter.FilterColumn("status", "status")
        );

        Specification<Survey> spec = specificationFilter.buildFilter(filter, columnsConfig);
        return surveyRepository.findAll(spec);
    }

    public Page<Survey> getStudentSurveys(Integer studentId, User applicator,
                                          SurveyFilter filter, Pageable pageable) {
        Specification<Survey> spec = Specification
                .where(belongsToStudent(studentId))
                .and(belongsToApplicator(applicator.getId()))
                .and(buildFilter(filter));

        return surveyRepository.findAll(spec, pageable);
    }

    public String getSurveyImageSignedUrl(Integer id) {
        Survey survey = findSurveyById(id);

        if (survey.getSurveyImagePath() == null || survey.getSurveyImagePath().isBlank()) {
            return null;
        }

        // Gera uma URL assinada válida por 1 hora (3600 segundos)
        return storageService.generateSignedUrl(survey.getSurveyImagePath(), IMAGE_URL_EXPIRATION_TIME);
    }

    private Specification<Survey> belongsToStudent(Integer studentId) {
        return (root, query, cb) -> cb.equal(root.get("student").get("id"), studentId);
    }

    private Specification<Survey> belongsToApplicator(Integer applicatorId) {
        return (root, query, cb) -> cb.equal(root.get("administrator").get("id"), applicatorId);
    }

    private Specification<Survey> buildFilter(SurveyFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null)
                return cb.and(predicates.toArray(new Predicate[0]));

            boolean hasSearch = filter.search() != null && !filter.search().isBlank();
            boolean hasStrand = filter.strandId() != null && filter.strandId() > 0;
            boolean hasBimester = filter.bimester() != null && !filter.bimester().isBlank();

            Join<Survey, Activity> activityJoin = (hasSearch || hasStrand || hasBimester)
                    ? root.join("activity", JoinType.INNER)
                    : null;

            if (hasSearch) {
                Join<Activity, Strand> strandJoin = activityJoin.join("strand", JoinType.INNER);

                String search = filter.search().toLowerCase();
                String searchPattern = "%" + search + "%";

                List<Predicate> orPredicates = new ArrayList<>();
                orPredicates.add(cb.like(cb.lower(activityJoin.get("name")), searchPattern));
                orPredicates.add(cb.like(cb.lower(strandJoin.get("subject")), searchPattern));
                orPredicates.add(cb.like(cb.lower(strandJoin.get("name")), searchPattern));
                orPredicates.add(cb.like(cb.lower(activityJoin.get("period")), searchPattern));

                Boolean status = null;
                if ("finalizada".startsWith(search)) {
                    status = true;
                } else if ("em aberto".startsWith(search) || "aberto".startsWith(search)) {
                    status = false;
                }

                if (status != null)
                    orPredicates.add(cb.equal(root.get("status"), status));

                predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
            }

            if (hasStrand)
                predicates.add(cb.equal(activityJoin.get("strand").get("id"), filter.strandId()));

            if (hasBimester)
                predicates.add(cb.equal(activityJoin.get("period"), filter.bimester()));

            if (filter.status() != null)
                predicates.add(cb.equal(root.get("status"), filter.status()));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}