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
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;


@Service
@AllArgsConstructor
public class SurveyService {

    private SurveyRepository surveyRepository;
    private UsersRepository usersRepository;
    private StudentRepository studentRepository;
    private ActivityRepository activityRepository;

    @Autowired
    private SpecificationFilter specificationFilter;

    public Survey createSurvey(SurveyForm form){
        Survey survey = new Survey(form);
        User administrator = findUserById(form.administratorId());
        Student student = findStudentById(form.studentId());
        Activity activity = findActivityById(form.activityId());

        survey.setAdministrator(administrator);
        survey.setStudent(student);
        survey.setActivity(activity);

        return surveyRepository.save(survey);
    }

    public Survey updateSurvey(Integer id, SurveyForm form){
        Survey survey = findSurveyById(id);
        User administrator = findUserById(form.administratorId());
        Student student = findStudentById(form.studentId());
        Activity activity = findActivityById(form.activityId());

        Survey surveyUpdated = Survey.buildUpdatedSurvey(form, administrator, student, activity);
        surveyUpdated.setId(survey.getId());

        return surveyRepository.save(surveyUpdated);
    }

    public void deleteSurvey(Integer id){
        Survey survey = findSurveyById(id);
        survey.setStatus(false);
        surveyRepository.save(survey);
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
                new SpecificationFilter.FilterColumn("subject", "subject"),
                new SpecificationFilter.FilterColumn("axis", "axis"),
                new SpecificationFilter.FilterColumn("result", "result"),
                new SpecificationFilter.FilterColumn("isDigital", "isDigital")
        );

        Specification<Survey> spec = specificationFilter.buildFilter(filter, columnsConfig);
        return surveyRepository.findAll(spec);
    }
}
