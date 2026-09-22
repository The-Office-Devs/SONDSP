package br.com.sondsp.filters;

public record SurveyFilter (
        String search,
        Integer strandId,
        String bimester,
        String result,
        String isDigital,
        Boolean status
){
}