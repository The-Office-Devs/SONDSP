package br.com.sondsp.services;

import br.com.sondsp.dtos.portfolio.TimelineEvolutionDTO;
import br.com.sondsp.dtos.portfolio.TimelineItemDTO;
import br.com.sondsp.entities.Survey;
import br.com.sondsp.entities.enums.ApplicationPeriod;
import br.com.sondsp.entities.enums.EvaluationType;
import br.com.sondsp.entities.enums.EvolutionComparison;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.repositories.SurveyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

import static br.com.sondsp.util.FileNameUtils.formatSurveyFileName;
import static br.com.sondsp.util.SystemMessages.STUDENT_NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentTimelineService {

    private final SurveyRepository surveyRepository;
    private final StudentRepository studentRepository;
    private final SupabaseStorageService storageService;
    private final SurveyPedagogicalLevelService pedagogicalLevelService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Transactional(readOnly = true)
    public List<TimelineItemDTO> getStudentTimeline(Integer studentId, Integer strandId) {
        if (!studentRepository.existsById(studentId)) {
            throw new EntityNotFoundException(STUDENT_NOT_FOUND);
        }

        // 1. Busca todas as sondagens finalizadas do aluno em ordem cronológica ascendente
        List<Survey> chronologicalSurveys = (strandId != null && strandId > 0)
                ? new ArrayList<>(surveyRepository.findAllByStudentIdAndActivityStrandIdAndStatusTrueOrderByDateAsc(studentId, strandId))
                : new ArrayList<>(surveyRepository.findAllByStudentIdAndStatusTrueOrderByDateAsc(studentId));

        // Ordena rigorosamente pela cronologia pedagógica: Ano Letivo ASC -> Bimestre ASC (Inicial a 4º) -> Data ASC -> ID ASC
        chronologicalSurveys.sort(Comparator
                .comparing(this::extractSurveyYear, Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparingInt(this::extractBimesterOrder)
                .thenComparing(Survey::getDate, Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparing(Survey::getId, Comparator.nullsFirst(Comparator.naturalOrder()))
        );

        // 2. Calcula a evolução dentro do mesmo eixo pedagógico
        Map<Integer, Survey> lastSurveyByStrand = new HashMap<>();
        List<TimelineItemDTO> timelineItems = new ArrayList<>();

        for (Survey survey : chronologicalSurveys) {
            Integer currentStrandId = (survey.getActivity() != null && survey.getActivity().getStrand() != null)
                    ? survey.getActivity().getStrand().getId()
                    : 0;

            String currentCode = survey.getResult() != null ? survey.getResult().trim() : "SEM_RESULTADO";
            Survey previousSurvey = lastSurveyByStrand.get(currentStrandId);

            TimelineEvolutionDTO evolution;
            if (previousSurvey == null) {
                evolution = new TimelineEvolutionDTO(
                        false,
                        EvolutionComparison.PRIMEIRO_REGISTRO,
                        null,
                        null,
                        currentCode,
                        "Sem registro anterior no eixo"
                );
            } else {
                String previousCode = previousSurvey.getResult() != null ? previousSurvey.getResult().trim() : "";
                boolean isChanged = !Objects.equals(previousCode, currentCode);
                EvolutionComparison comparison = isChanged ? EvolutionComparison.ALTERADO : EvolutionComparison.MANTIDO;
                String evolutionText = isChanged ? (previousCode + " → " + currentCode) : (currentCode + " mantido");

                evolution = new TimelineEvolutionDTO(
                        true,
                        comparison,
                        previousSurvey.getId(),
                        previousCode,
                        currentCode,
                        evolutionText
                );
            }

            // Atualiza o último registro do eixo para a próxima comparação
            lastSurveyByStrand.put(currentStrandId, survey);

            // Monta o item do timeline
            String strandName = (survey.getActivity() != null && survey.getActivity().getStrand() != null)
                    ? survey.getActivity().getStrand().getName()
                    : "Sondagem";

            String strandKey = determineStrandKey(survey);
            String evaluationType = determineEvaluationType(survey);
            String formattedDate = survey.getDate() != null ? survey.getDate().format(DATE_FORMATTER) : "";
            String schoolYear = (survey.getSchoolClass() != null && survey.getSchoolClass().getSchoolYear() != null)
                    ? survey.getSchoolClass().getSchoolYear()
                    : (survey.getDate() != null ? String.valueOf(survey.getDate().getYear()) : "2026");

            ApplicationPeriod period = parseApplicationPeriod(survey.getApplicationPeriod());

            boolean hasEvidence = survey.getSurveyImagePath() != null && !survey.getSurveyImagePath().isBlank();
            String evidenceUrl = null;
            if (hasEvidence) {
                try {
                    evidenceUrl = storageService.generateSignedUrl(survey.getSurveyImagePath(), formatSurveyFileName(survey));
                } catch (Exception e) {
                    log.warn("Não foi possível gerar URL assinada do Supabase para a imagem [{}]: {}", survey.getSurveyImagePath(), e.getMessage());
                }
            }
            String activityTitle = (survey.getActivity() != null) ? survey.getActivity().getName() : "Atividade de Sondagem";

            TimelineItemDTO itemDTO = new TimelineItemDTO(
                    survey.getId(),
                    survey.getId(),
                    strandName,
                    strandKey,
                    evaluationType,
                    survey.getApplicationPeriod() != null ? survey.getApplicationPeriod() : "Sondagem",
                    period,
                    schoolYear,
                    formattedDate,
                    survey.getDate(),
                    activityTitle,
                    currentCode,
                    pedagogicalLevelService.getLevelLabel(currentCode),
                    evolution,
                    survey.getNotes(),
                    hasEvidence,
                    evidenceUrl,
                    activityTitle
            );

            timelineItems.add(itemDTO);
        }

        // 3. Inverte para ordem cronológica decrescente (mais recente no topo da timeline)
        Collections.reverse(timelineItems);
        return timelineItems;
    }

    private String determineStrandKey(Survey survey) {
        if (survey.getActivity() != null && survey.getActivity().getStrand() != null) {
            String code = survey.getActivity().getStrand().getCode();
            if (code != null) {
                return switch (code.toUpperCase(Locale.ROOT)) {
                    case "LEITURA" -> "leitura";
                    case "ESCRITA_NUMEROS", "SITUACOES_PROBLEMA" -> "matematica";
                    case "ESCRITA" -> "escrita";
                    default -> "escrita";
                };
            }
        }
        return "escrita";
    }

    private String determineEvaluationType(Survey survey) {
        if (survey.getActivity() != null) {
            return pedagogicalLevelService.getEvaluationTypeForActivity(survey.getActivity()).name();
        }
        return EvaluationType.ESCRITA_SEA.name();
    }

    private ApplicationPeriod parseApplicationPeriod(String period) {
        if (period == null || period.isBlank()) return null;
        try {
            return ApplicationPeriod.valueOf(period.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            String lower = period.toLowerCase();
            if (lower.contains("inicial")) return ApplicationPeriod.INICIAL;
            if (lower.contains("1")) return ApplicationPeriod.PRIMEIRO_BIMESTRE;
            if (lower.contains("2")) return ApplicationPeriod.SEGUNDO_BIMESTRE;
            if (lower.contains("3")) return ApplicationPeriod.TERCEIRO_BIMESTRE;
            if (lower.contains("4")) return ApplicationPeriod.QUARTO_BIMESTRE;
            return null;
        }
    }

    private String extractSurveyYear(Survey survey) {
        if (survey.getSchoolClass() != null && survey.getSchoolClass().getSchoolYear() != null && !survey.getSchoolClass().getSchoolYear().isBlank()) {
            return survey.getSchoolClass().getSchoolYear().trim();
        }
        if (survey.getDate() != null) {
            return String.valueOf(survey.getDate().getYear());
        }
        return "2026";
    }

    private int extractBimesterOrder(Survey survey) {
        String period = survey.getApplicationPeriod();
        if (period == null || period.isBlank()) {
            if (survey.getActivity() != null && survey.getActivity().getPeriod() != null) {
                period = survey.getActivity().getPeriod();
            }
        }
        if (period == null) return 99;
        String lower = period.toLowerCase();
        if (lower.contains("inicial") || lower.contains("inic")) return 0;
        if (lower.contains("1") || lower.contains("primeiro")) return 1;
        if (lower.contains("2") || lower.contains("segundo")) return 2;
        if (lower.contains("3") || lower.contains("terceiro")) return 3;
        if (lower.contains("4") || lower.contains("quarto")) return 4;
        return 99;
    }
}
