package br.com.sondsp.dtos.portfolio;

import br.com.sondsp.entities.enums.EvolutionComparison;

public record TimelineEvolutionDTO(
    boolean hasEvolution,
    EvolutionComparison comparison,
    Integer previousSurveyId,
    String previousCode,
    String currentCode,
    String text
) {}
