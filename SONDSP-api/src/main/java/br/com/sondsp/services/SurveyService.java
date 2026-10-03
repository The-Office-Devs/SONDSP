package br.com.sondsp.services;

import br.com.sondsp.entities.*;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import br.com.sondsp.repositories.ActivityRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.repositories.SurveyRepository;
import br.com.sondsp.repositories.UsersRepository;
import br.com.sondsp.util.SpecificationFilter;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.xml.bind.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static br.com.sondsp.util.SystemMessages.*;


@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final UsersRepository usersRepository;
    private final StudentRepository studentRepository;
    private final ActivityRepository activityRepository;

    private final ActivityService activityService;

    @Value("${upload-dir:/sondsp/sondagens}")
    private String uploadDir;

    @Autowired
    private SpecificationFilter specificationFilter;

    public Survey createSurvey(SurveyForm form, User administrator) {
        Student student = findStudentById(form.studentId());
        Activity activity = findActivityById(form.activityModelId());
        Survey survey = new Survey(form, administrator, student, activity);

        if (form.image() != null && !form.image().isEmpty()) {
            String savedImagePath = storeImageLocal(form.image());
            survey.setSurveyImagePath(savedImagePath);
        }

        return surveyRepository.save(survey);
    }

    public Survey updateSurvey(Integer id, SurveyForm form){
        Survey survey = findSurveyById(id);
        survey.setResult(form.result());
        survey.setNotes(form.notes());
        survey.setStatus(true);

        if (form.image() != null && !form.image().isEmpty()) {
            String savedImagePath = storeImageLocal(form.image());
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

    private String storeImageLocal(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(this.uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            String uniqueFileName = UUID.randomUUID() + "_" + originalFileName;

            Path targetLocation = uploadPath.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return targetLocation.toString();

        } catch (IOException ex) {
            throw new RuntimeException(ERROR_SAVING_IMAGE, ex);
        }
    }

    public Resource getSurveyImage(Integer id) {
        Survey survey = findSurveyById(id);
        return activityService.getImageLocal(survey.getSurveyImagePath());
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
