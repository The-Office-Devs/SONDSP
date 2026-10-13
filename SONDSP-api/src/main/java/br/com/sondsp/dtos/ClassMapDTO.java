package br.com.sondsp.dtos;

import java.util.List;

public record ClassMapDTO(
	Integer schoolId,
	String schoolName,
	Integer schoolClassId,
	String schoolClassName,
	List<DomainPercentageDTO> domainPercentage,
	List<DistributionDTO> distribution,
	List<EvolutionComparativeDTO> evolutionComparative
) {}
