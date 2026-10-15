package br.com.sondsp.services;

import static br.com.sondsp.util.SystemConstants.IMAGE_URL_EXPIRATION_TIME;
import static br.com.sondsp.util.SystemMessages.*;

import br.com.sondsp.entities.*;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import br.com.sondsp.repositories.*;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.util.SpecificationFilter;
import br.com.sondsp.util.SystemMessages;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.*;
import jakarta.xml.bind.ValidationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final StudentRepository studentRepository;
    private final ActivityRepository activityRepository;
    private final SupabaseStorageService storageService;

    @Autowired
    private SpecificationFilter specificationFilter;

    public Survey createSurvey(SurveyForm form) throws IOException, ValidationException {
      User creator = authenticationService
        .getCurrentUser()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, SystemMessages.USER_NOT_FOUND));

      Student student = findStudentById(form.studentId());
      Activity activity = findActivityById(form.activityModelId());

      if (
        surveyRepository.existsByStudentIdAndActivityIdAndStatus(form.studentId(), form.activityModelId(), false)
      ) throw new ValidationException(HAS_OPEN_SURVEY_SAME_ACVTY);

      Survey survey = new Survey(form, creator, student, activity);

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
      if (
        survey.getStatus().equals(false) &&
        !StringUtils.hasText(survey.getSurveyImagePath()) &&
        !StringUtils.hasText(survey.getResult())
      ) {
        surveyRepository.delete(survey);
      } else {
        throw new ValidationException(SURVEY_CANNOT_DELETE);
      }
    }

    private Survey findSurveyById(Integer id) {
      return this.surveyRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(SURVEY_NOT_FOUND));
    }

    private Student findStudentById(Integer id) {
      return this.studentRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(STUDENT_NOT_FOUND));
    }

    private Activity findActivityById(Integer id) {
      return this.activityRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(ACTIVITY_NOT_FOUND));
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

    public Page<Survey> getStudentSurveys(Integer studentId, User applicator, SurveyFilter filter, Pageable pageable) {
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

        return storageService.generateSignedUrl(survey.getSurveyImagePath(), formatSurveyFileName(survey));
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
            boolean hasApplicationPeriod = filter.applicationPeriod() != null && !filter.applicationPeriod().isBlank();

            Join<Survey, Activity> activityJoin = (hasSearch || hasStrand)
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
                orPredicates.add(cb.like(cb.lower(root.get("applicationPeriod")), searchPattern));

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

            if (hasApplicationPeriod)
                predicates.add(cb.equal(root.get("applicationPeriod"), filter.applicationPeriod()));

            if (filter.status() != null)
                predicates.add(cb.equal(root.get("status"), filter.status()));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}