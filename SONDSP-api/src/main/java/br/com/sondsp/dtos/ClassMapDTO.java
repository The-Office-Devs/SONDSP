package br.com.sondsp.dtos;

import java.util.List;

public record ClassMapDTO(
	Integer schoolId,
	String schoolName,
	Integer schoolClassId,
	String schoolClassName,
	List<DomainPercentageDTO> percentualDominio,
	List<DistributionDTO> distribuicao,
	List<EvolutionComparativeDTO> evolucaoComparativo
) {}
