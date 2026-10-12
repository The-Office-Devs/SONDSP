package br.com.sondsp.filters;

import java.time.LocalDate;

public record SurveyFilter(
	String search,
	Integer strandId,
	String result,
	String isDigital,
	Boolean status,
	String applicationPeriod,
    LocalDate date
) {}
