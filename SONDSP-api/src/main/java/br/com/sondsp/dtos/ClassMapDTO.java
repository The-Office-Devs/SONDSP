package br.com.sondsp.dtos;

import java.util.List;

public record ClassMapDTO(
	String schoolClassName,
	List<DomainPercentageDTO> domainPercentage,
	List<DistributionDTO> distribution,
	List<EvolutionComparativeDTO> evolutionComparative
) {}
