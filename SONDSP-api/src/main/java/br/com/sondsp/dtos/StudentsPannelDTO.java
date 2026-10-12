package br.com.sondsp.dtos;

import java.time.LocalDateTime;

public record StudentsPannelDTO(
	Integer studentId,
	String studentName,
	String result
) {}
