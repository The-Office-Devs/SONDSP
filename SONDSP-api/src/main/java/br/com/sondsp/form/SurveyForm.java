package br.com.sondsp.form;

import org.springframework.web.multipart.MultipartFile;

public record SurveyForm(
	Integer studentId,
	String result,
	String notes,
	Integer activityModelId,
	MultipartFile image,
	String applicationPeriod
) {}
