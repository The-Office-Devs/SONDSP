package br.com.sondsp.filters;

public record SurveyFilter (
        String search,
        String result,
        String isDigital,
        Boolean status
){
}