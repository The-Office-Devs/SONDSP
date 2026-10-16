package br.com.sondsp.services;

import br.com.sondsp.dtos.survey.SurveyResultOptionDTO;
import br.com.sondsp.entities.Activity;
import jakarta.validation.ValidationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Serviço que implementa a Matriz Oficial de Níveis e Diretrizes Pedagógicas de Sondagem
 * da Secretaria Municipal de Educação de São Paulo (SME-SP / COPED / DIEFEM).
 * Atua como FONTE ÚNICA DE VERDADE para os vereditos aceitos por eixo e ano escolar.
 */
@Service
public class SurveyPedagogicalLevelService {

    public List<SurveyResultOptionDTO> getResultOptionsForActivity(Activity activity) {
        String strandName = (activity != null && activity.getStrand() != null)
                ? activity.getStrand().getName()
                : "";
        String gradeLevel = (activity != null && activity.getGradeLevel() != null)
                ? activity.getGradeLevel()
                : "";
        String activityName = (activity != null && activity.getName() != null)
                ? activity.getName()
                : "";

        return getResultOptions(strandName, gradeLevel, activityName);
    }

    public List<SurveyResultOptionDTO> getResultOptions(String strandName, String gradeLevel, String activityName) {
        String normalizedStrand = strandName != null ? strandName.trim().toLowerCase(Locale.ROOT) : "";
        String normalizedGrade = gradeLevel != null ? gradeLevel.trim().toLowerCase(Locale.ROOT) : "";
        String normalizedActivity = activityName != null ? activityName.trim().toLowerCase(Locale.ROOT) : "";

        // 1. Eixo: Língua Portuguesa — Leitura
        if (normalizedStrand.contains("leitura") || normalizedActivity.contains("leitura")) {
            return getReadingOptions();
        }

        // 2. Eixo: Matemática
        if (normalizedStrand.contains("matem") || normalizedActivity.contains("matem")) {
            if (normalizedActivity.contains("problema") || normalizedActivity.contains("campo") || normalizedActivity.contains("situac")) {
                return getMathProblemOptions();
            }
            return getMathNumberWritingOptions();
        }

        // 3. Eixo: Língua Portuguesa — Escrita (Diferenciado por Ano Escolar)
        if (normalizedGrade.contains("2") || normalizedGrade.contains("3") ||
            normalizedActivity.contains("convite") || normalizedActivity.contains("conto") || normalizedActivity.contains("producao")) {
            return getTextProductionOptions();
        }

        // Padrão: 1º Ano SEA (Sistema de Escrita Alfabética)
        return getSeaOptions();
    }

    public void validateResult(Activity activity, String result) {
        if (result == null || result.isBlank()) {
            throw new ValidationException("O resultado da avaliação da sondagem é obrigatório.");
        }

        String candidate = result.trim().toUpperCase(Locale.ROOT);
        List<SurveyResultOptionDTO> allowedOptions = getResultOptionsForActivity(activity);

        boolean isValid = allowedOptions.stream().anyMatch(opt -> 
            opt.value().equalsIgnoreCase(candidate)
        );

        if (!isValid) {
            String allowedList = allowedOptions.stream()
                    .map(SurveyResultOptionDTO::value)
                    .collect(Collectors.joining(", "));
            String activityDesc = activity != null ? activity.getName() : "Atividade";
            String strandDesc = (activity != null && activity.getStrand() != null) ? activity.getStrand().getName() : "Geral";
            String gradeDesc = activity != null ? activity.getGradeLevel() : "Geral";

            throw new ValidationException(String.format(
                    "O resultado '%s' não é válido para a atividade '%s' (Eixo: %s, Ano: %s). Conforme as diretrizes da SME-SP, os níveis permitidos são: [%s].",
                    result, activityDesc, strandDesc, gradeDesc, allowedList
            ));
        }
    }

    /**
     * Níveis Oficiais do SEA (1º Ano e Diagnóstico Excepcional de 2º/3º Anos)
     */
    public List<SurveyResultOptionDTO> getSeaOptions() {
        return List.of(
                new SurveyResultOptionDTO("PS", "Pré-Silábica (PS)", "SEA"),
                new SurveyResultOptionDTO("SSVC", "Silábica Sem Valor Sonoro (SSVC)", "SEA"),
                new SurveyResultOptionDTO("SCVC", "Silábica Com Valor Sonoro (SCVC)", "SEA"),
                new SurveyResultOptionDTO("SA", "Silábico-Alfabética (SA)", "SEA"),
                new SurveyResultOptionDTO("A", "Alfabética (A)", "SEA")
        );
    }

    /**
     * Níveis de Produção Textual (2º Ano Convite / 3º Ano Final de Conto — Saeb 743)
     * Inclui hipóteses do SEA para suporte normativo a estudantes não alfabéticos (Diretrizes 2.1.B e 2.1.C da SME-SP).
     */
    public List<SurveyResultOptionDTO> getTextProductionOptions() {
        List<SurveyResultOptionDTO> options = new ArrayList<>();
        options.add(new SurveyResultOptionDTO("NIVEL_01", "Nível 01 — Não produziu / Em branco / Fuga ao gênero", "PRODUCAO_TEXTO"));
        options.add(new SurveyResultOptionDTO("NIVEL_02", "Nível 02 — Fuga ao tema / Reescrita sem autoria", "PRODUCAO_TEXTO"));
        options.add(new SurveyResultOptionDTO("NIVEL_03", "Nível 03 — Ausência de elementos / Coerência parcial", "PRODUCAO_TEXTO"));
        options.add(new SurveyResultOptionDTO("NIVEL_04", "Nível 04 — Produção adequada / Autoria criativa consistente", "PRODUCAO_TEXTO"));
        
        // Hipóteses excepcionais do SEA admitidas pela SME-SP
        options.add(new SurveyResultOptionDTO("PS", "Pré-Silábica (PS - Diagnóstico SEA)", "DIAGNOSTICO_SEA"));
        options.add(new SurveyResultOptionDTO("SSVC", "Silábica Sem Valor (SSVC - Diagnóstico SEA)", "DIAGNOSTICO_SEA"));
        options.add(new SurveyResultOptionDTO("SCVC", "Silábica Com Valor (SCVC - Diagnóstico SEA)", "DIAGNOSTICO_SEA"));
        options.add(new SurveyResultOptionDTO("SA", "Silábico-Alfabética (SA - Diagnóstico SEA)", "DIAGNOSTICO_SEA"));
        return Collections.unmodifiableList(options);
    }

    /**
     * Níveis de Ditado de Números do Sistema de Numeração Decimal (SND) — 1º ao 3º Anos
     */
    public List<SurveyResultOptionDTO> getMathNumberWritingOptions() {
        return List.of(
                new SurveyResultOptionDTO("NIVEL_01", "Nível 01 — Não utiliza algarismos (letras, garatujas)", "ESCRITA_NUMEROS"),
                new SurveyResultOptionDTO("NIVEL_02", "Nível 02 — Reconhece algarismos sem correspondência plena", "ESCRITA_NUMEROS"),
                new SurveyResultOptionDTO("NIVEL_03", "Nível 03 — Apoio na oralidade e justaposição aditiva (ex: 704 para 74)", "ESCRITA_NUMEROS"),
                new SurveyResultOptionDTO("NIVEL_04", "Nível 04 — Domínio parcial do valor posicional (nós e zeros intercalados)", "ESCRITA_NUMEROS"),
                new SurveyResultOptionDTO("NIVEL_05", "Nível 05 — Domínio consolidado do Sistema de Numeração Decimal", "ESCRITA_NUMEROS")
        );
    }

    /**
     * Níveis de Resolução de Situações-Problema de Matemática
     */
    public List<SurveyResultOptionDTO> getMathProblemOptions() {
        return List.of(
                new SurveyResultOptionDTO("ACERTOU", "Acertou plenamente", "SITUACOES_PROBLEMA"),
                new SurveyResultOptionDTO("ACERTOU_PARCIALMENTE", "Acertou parcialmente", "SITUACOES_PROBLEMA"),
                new SurveyResultOptionDTO("ERROU", "Errou ou não resolveu", "SITUACOES_PROBLEMA")
        );
    }

    /**
     * Opções de Avaliação de Práticas de Leitura
     */
    public List<SurveyResultOptionDTO> getReadingOptions() {
        return List.of(
                new SurveyResultOptionDTO("ADEQUADA", "Compreensão Adequada", "LEITURA"),
                new SurveyResultOptionDTO("INADEQUADA", "Compreensão Inadequada", "LEITURA"),
                new SurveyResultOptionDTO("NAO_RESPONDEU", "Não Respondeu", "LEITURA")
        );
    }
}
