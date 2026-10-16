package br.com.sondsp.form;

import org.springframework.web.multipart.MultipartFile;

public record SurveyForm(
	Integer studentId,
	String result,
	Boolean isDigital,
	String notes,
	Integer activityModelId,
	MultipartFile image,
	String applicationPeriod
) {}
