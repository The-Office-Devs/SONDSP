package br.com.sondsp.dtos;

import br.com.sondsp.entities.Survey;

import java.time.LocalDateTime;

public record SurveyDTO(
        Integer id,
        String administratorName,
        Integer administratorId,
        String studentName,
        Integer studentId,
        String applicationPeriod,
        ActivityDTO activity,
        String result,
        String notes,
        String surveyImage,
        Boolean isDigital,
        Boolean status,
        LocalDateTime date
) {
    public SurveyDTO(Survey survey){
        this(
                survey.getId(),
                survey.getAdministrator() != null ? survey.getAdministrator().getName() :null,
                survey.getAdministrator() != null ? survey.getAdministrator().getId() :null,
                survey.getStudent() != null ? survey.getStudent().getName() :null,
                survey.getStudent() != null ? survey.getStudent().getId() :null,
                survey.getApplicationPeriod() != null ? survey.getApplicationPeriod() : null,
                survey.getActivity() != null ? new ActivityDTO(survey.getActivity()) : null,
                survey.getResult(),
                survey.getNotes(),
                survey.getSurveyImagePath(),
                survey.getIsDigital(),
                survey.getStatus(),
                survey.getDate()
        );
    }
}
