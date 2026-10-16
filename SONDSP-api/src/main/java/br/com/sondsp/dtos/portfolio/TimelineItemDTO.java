package br.com.sondsp.dtos.portfolio;

import br.com.sondsp.entities.enums.ApplicationPeriod;

import java.time.LocalDateTime;

public record TimelineItemDTO(
    Integer id,
    Integer surveyId,
    String strand,
    String strandKey,
    String evaluationType,
    String bimester,
    ApplicationPeriod period,
    String schoolYear,
    String date,
    LocalDateTime appliedAt,
    String activityTitle,
    String levelCode,
    String levelLabel,
    TimelineEvolutionDTO evolution,
    String notes,
    boolean hasEvidence,
    String evidenceUrl,
    String evidenceTitle
) {}
