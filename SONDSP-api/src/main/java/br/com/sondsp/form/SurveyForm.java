package br.com.sondsp.form;

public record SurveyForm(
        Integer administratorId,
        Integer studentId,
        String subject,
        String axios,
        String result,
        Boolean isDigital,
        String surveyImage,
        String observations,
        Integer activityId
) {
}
