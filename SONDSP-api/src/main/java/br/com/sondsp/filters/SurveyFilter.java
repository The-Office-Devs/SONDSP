package br.com.sondsp.filters;

import java.time.LocalDate;

public record SurveyFilter (
        String search,
        Integer strandId,
        String bimester,
        String result,
        String isDigital,
        Boolean status,
        LocalDate date
){
}