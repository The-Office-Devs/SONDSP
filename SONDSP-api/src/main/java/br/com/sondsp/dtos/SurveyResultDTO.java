package br.com.sondsp.dtos;

import java.time.LocalDateTime;

public record SurveyResultDTO(
        Integer studentId,
        Integer strandId,
        String strandName,
        String applicationPeriod,
        String result,
        LocalDateTime date,
        Integer surveyId
) {}