package br.com.sondsp.services;

import br.com.sondsp.entities.Activity;
import br.com.sondsp.entities.Student;
import br.com.sondsp.entities.Survey;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import br.com.sondsp.repositories.ActivityRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.repositories.SurveyRepository;
import br.com.sondsp.repositories.UsersRepository;
import br.com.sondsp.util.SpecificationFilter;
import jakarta.persistence.EntityNotFoundException;
import jakarta.xml.bind.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    @Value("${upload-dir:/sondsp/sondagens}")
    private String uploadDir;

    @Autowired
    private SpecificationFilter specificationFilter;

    public Survey createSurvey(SurveyForm form, User administrator) {
        Student student = findStudentById(form.studentId());
        Activity activity = findActivityById(form.activityId());
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
        survey.setObservations(form.observations());
        survey.setStatus(true);

        if (form.image() != null && !form.image().isEmpty()) {
            String savedImagePath = storeImageLocal(form.image());
            survey.setSurveyImagePath(savedImagePath);
        }

        return surveyRepository.save(survey);
    }

    public void deleteSurvey(Integer id) throws ValidationException {
        Survey survey = findSurveyById(id);
        if(Boolean.FALSE.equals(survey.getStatus())){
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

    private User findUserById(Integer id){
        return this.usersRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(USER_NOT_FOUND)
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
            throw new RuntimeException("Não foi possível salvar o arquivo de imagem. Tente novamente!", ex);
        }
    }
}
