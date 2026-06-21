package br.com.sondsp.form;

import org.springframework.web.multipart.MultipartFile;

public record SurveyForm(
        Integer studentId,
        String subject,
        String axis,
        String result,
        Boolean isDigital,
        String observations,
        Integer activityId,
        MultipartFile image
) {
}
