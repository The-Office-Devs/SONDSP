package br.com.sondsp.dtos;

import br.com.sondsp.entities.Survey;

public record SurveyDTO(
        Integer id,
        String administratorName,
        Integer administratorId,
        String studentName,
        Integer studentId,
        String result,
        String observations,
        String surveyImage,
        Boolean isDigital,
        String activityName,
        Boolean status
) {
    public SurveyDTO(Survey survey){
        this(
                survey.getId(),
                survey.getAdministrator() != null ? survey.getAdministrator().getName() :null,
                survey.getAdministrator() != null ? survey.getAdministrator().getId() :null,
                survey.getStudent() != null ? survey.getStudent().getName() :null,
                survey.getStudent() != null ? survey.getStudent().getId() :null,
                survey.getResult(),
                survey.getObservations(),
                survey.getSurveyImagePath(),
                survey.getIsDigital(),
                survey.getActivity() != null ? survey.getActivity().getName() :null,
                survey.getStatus()
        );
    }
}
