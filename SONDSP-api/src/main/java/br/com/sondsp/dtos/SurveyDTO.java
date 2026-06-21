package br.com.sondsp.dtos;

import br.com.sondsp.entities.Activity;
import br.com.sondsp.entities.Student;
import br.com.sondsp.entities.Survey;
import br.com.sondsp.entities.User;

public record SurveyDTO(
        Integer id,
        User administrator,
        Student student,
        String subject,
        String axis,
        String result,
        String observations,
        String surveyImage,
        Boolean isDigital,
        Activity activity,
        Boolean status
) {
    public SurveyDTO(Survey survey){
        this(
                survey.getId(),
                survey.getAdministrator(),
                survey.getStudent(),
                survey.getSubject(),
                survey.getAxis(),
                survey.getResult(),
                survey.getObservations(),
                survey.getSurveyImage(),
                survey.getIsDigital(),
                survey.getActivity(),
                survey.getStatus()
        );
    }
}
