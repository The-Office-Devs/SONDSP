package br.com.sondsp.dtos;

import java.time.LocalDateTime;

public record StudentsPannelDTO(
	Integer studentId,
	String studentName,
	Integer rowNumber,
	Integer surveyId,
	Integer applierId,
	String applierName,
	String result,
	LocalDateTime data
) {}
