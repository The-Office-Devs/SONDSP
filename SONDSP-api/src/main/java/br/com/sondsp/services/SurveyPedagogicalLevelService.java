package br.com.sondsp.services;

import br.com.sondsp.dtos.survey.SurveyResultOptionDTO;
import br.com.sondsp.entities.Activity;
import br.com.sondsp.entities.Strand;
import br.com.sondsp.entities.enums.EvaluationType;
import jakarta.validation.ValidationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Serviço que implementa a Matriz Oficial de Níveis e Diretrizes Pedagógicas de Sondagem
 * da Secretaria Municipal de Educação de São Paulo (SME-SP / COPED / DIEFEM).
 * Atua como FONTE ÚNICA DE VERDADE para os vereditos, instrumentos e metas pedagógicas.
 */
@Service
public class SurveyPedagogicalLevelService {

    /**
     * Determina de forma 100% determinística o instrumento pedagógico com base no Eixo Oficial e Ano Escolar.
     * Elimina completamente qualquer dependência ou inspeção do texto livre do nome da atividade.
     */
    public EvaluationType getEvaluationType(Strand strand, String gradeLevel) {
        String code = (strand != null && strand.getCode() != null)
                ? strand.getCode().trim().toUpperCase(Locale.ROOT)
                : "";

        String normalizedGrade = (gradeLevel != null) ? gradeLevel.trim().toLowerCase(Locale.ROOT) : "";

        return switch (code) {
            case "LEITURA" -> EvaluationType.LEITURA;
            case "ESCRITA_NUMEROS" -> EvaluationType.ESCRITA_NUMEROS;
            case "SITUACOES_PROBLEMA",
                 "NUMEROS_PROBLEMAS",
                 "ALGEBRA",
                 "GEOMETRIA",
                 "GRANDEZAS_MEDIDAS",
                 "PROBABILIDADE_ESTATISTICA" -> EvaluationType.SITUACOES_PROBLEMA;
            case "ESCRITA" -> (normalizedGrade.contains("2") || normalizedGrade.contains("3"))
                    ? EvaluationType.PRODUCAO_TEXTO
                    : EvaluationType.ESCRITA_SEA;
            default -> throw new IllegalArgumentException("Código de eixo não reconhecido ou ausente: '" + code + "'. Os eixos oficiais da SME-SP são fixos: LEITURA, ESCRITA, ESCRITA_NUMEROS, NUMEROS_PROBLEMAS, ALGEBRA, GEOMETRIA, GRANDEZAS_MEDIDAS e PROBABILIDADE_ESTATISTICA.");
        };
    }

    public EvaluationType getEvaluationTypeForActivity(Activity activity) {
        Strand strand = (activity != null) ? activity.getStrand() : null;
        String gradeLevel = (activity != null) ? activity.getGradeLevel() : "";
        return getEvaluationType(strand, gradeLevel);
    }

    /**
     * Retorna a lista de opções de resultados válidos para uma Atividade.
     */
    public List<SurveyResultOptionDTO> getResultOptionsForActivity(Activity activity) {
        EvaluationType type = getEvaluationTypeForActivity(activity);
        return getResultOptionsByType(type);
    }

    /**
     * Retorna as opções oficiais a partir do Eixo e Ano Escolar.
     */
    public List<SurveyResultOptionDTO> getResultOptions(Strand strand, String gradeLevel) {
        EvaluationType type = getEvaluationType(strand, gradeLevel);
        return getResultOptionsByType(type);
    }

    /**
     * Sobrecarga para consultas por código do Eixo e Ano Escolar.
     */
    public List<SurveyResultOptionDTO> getResultOptions(String strandCode, String gradeLevel) {
        Strand mockStrand = new Strand();
        if (strandCode != null) {
            mockStrand.setCode(strandCode.trim().toUpperCase(Locale.ROOT));
        }
        return getResultOptions(mockStrand, gradeLevel);
    }

    /**
     * Retorna o catálogo canônico de opções conforme o tipo de instrumento.
     */
    public List<SurveyResultOptionDTO> getResultOptionsByType(EvaluationType type) {
        return switch (type) {
            case LEITURA -> getReadingOptions();
            case ESCRITA_NUMEROS -> getMathNumberWritingOptions();
            case SITUACOES_PROBLEMA -> getMathProblemOptions();
            case PRODUCAO_TEXTO -> getTextProductionOptions();
            case ESCRITA_SEA -> getSeaOptions();
        };
    }

    /**
     * Valida se um resultado digitado é estritamente admitido pelas Diretrizes da SME-SP.
     */
    public void validateResult(Activity activity, String result) {
        if (result == null || result.isBlank()) {
            throw new ValidationException("O resultado da avaliação da sondagem é obrigatório.");
        }

        String candidate = result.trim().toUpperCase(Locale.ROOT);
        EvaluationType type = getEvaluationTypeForActivity(activity);
        List<SurveyResultOptionDTO> allowedOptions = new ArrayList<>(getResultOptionsByType(type));

        // Para 2º e 3º anos (produção de texto), a SME-SP admite excepcionalmente hipóteses do SEA para alunos não alfabéticos
        if (type == EvaluationType.PRODUCAO_TEXTO) {
            allowedOptions.addAll(getSeaOptions());
        }

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
     * Regra oficial de verificação de meta pedagógica: verifica se o estudante atingiu
     * o nível consolidado/esperado daquele objeto de avaliação.
     */
    public boolean isExpectedLevel(Activity activity, String result) {
        if (result == null || result.isBlank()) return false;
        String trimmed = result.trim().toUpperCase(Locale.ROOT);
        EvaluationType type = getEvaluationTypeForActivity(activity);

        return switch (type) {
            case LEITURA -> trimmed.equals("ADEQUADA");
            case ESCRITA_NUMEROS -> trimmed.equals("NIVEL_05");
            case SITUACOES_PROBLEMA -> trimmed.equals("ACERTOU");
            case PRODUCAO_TEXTO -> trimmed.equals("NIVEL_04");
            case ESCRITA_SEA -> trimmed.equals("A");
        };
    }

    /**
     * Retorna o rótulo descritivo oficial de qualquer hipótese ou código de resultado.
     */
    public String getLevelLabel(String code) {
        if (code == null || code.isBlank()) return "Sem avaliação";
        return switch (code.trim().toUpperCase(Locale.ROOT)) {
            case "PS" -> "PS — Pré-Silábica";
            case "SSVC" -> "SSVC — Silábico sem valor sonoro convencional";
            case "SCVC" -> "SCVC — Silábico com valor convencional";
            case "SA" -> "SA — Silábico-Alfabética";
            case "A" -> "A — Alfabética";
            case "NIVEL_01" -> "Nível 01";
            case "NIVEL_02" -> "Nível 02";
            case "NIVEL_03" -> "Nível 03";
            case "NIVEL_04" -> "Nível 04";
            case "NIVEL_05" -> "Nível 05";
            case "ADEQUADA" -> "Adequada — Práticas de Leitura";
            case "INADEQUADA" -> "Inadequada — Práticas de Leitura";
            case "NAO_RESPONDEU" -> "Não respondeu";
            case "ACERTOU" -> "Acertou plenamente";
            case "ACERTOU_PARCIALMENTE" -> "Acertou parcialmente";
            case "ERROU" -> "Errou ou não resolveu";
            default -> code;
        };
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
     */
    public List<SurveyResultOptionDTO> getTextProductionOptions() {
        return List.of(
                new SurveyResultOptionDTO("NIVEL_01", "Nível 01 — Não produziu / Em branco / Fuga ao gênero", "PRODUCAO_TEXTO"),
                new SurveyResultOptionDTO("NIVEL_02", "Nível 02 — Fuga ao tema / Reescrita sem autoria", "PRODUCAO_TEXTO"),
                new SurveyResultOptionDTO("NIVEL_03", "Nível 03 — Ausência de elementos / Coerência parcial", "PRODUCAO_TEXTO"),
                new SurveyResultOptionDTO("NIVEL_04", "Nível 04 — Produção adequada / Autoria criativa consistente", "PRODUCAO_TEXTO")
        );
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
                new SurveyResultOptionDTO("ERROU", "Errou ou não resolveu", "SITUACOES_PROBLEMA"),
                new SurveyResultOptionDTO("ACERTOU_PARCIALMENTE", "Acertou parcialmente", "SITUACOES_PROBLEMA"),
                new SurveyResultOptionDTO("ACERTOU", "Acertou plenamente", "SITUACOES_PROBLEMA")
        );
    }

    /**
     * Opções de Avaliação de Práticas de Leitura (Ordenadas do não leitor ao leitor com compreensão adequada)
     */
    public List<SurveyResultOptionDTO> getReadingOptions() {
        return List.of(
                new SurveyResultOptionDTO("NAO_RESPONDEU", "Não Respondeu", "LEITURA"),
                new SurveyResultOptionDTO("INADEQUADA", "Compreensão Inadequada", "LEITURA"),
                new SurveyResultOptionDTO("ADEQUADA", "Compreensão Adequada", "LEITURA")
        );
    }
}
