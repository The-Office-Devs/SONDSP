package br.com.sondsp.filters;

public record ClassMapFilter(
	Integer schoolId,
	Integer schoolClassId,
	String subjectName,
	String subject,
	Integer strandId,
	String period
) {}
