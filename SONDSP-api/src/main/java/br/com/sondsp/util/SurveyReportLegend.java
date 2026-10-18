package br.com.sondsp.util;

import br.com.sondsp.dtos.SchoolClassSurveysReportDTO.LegendEntry;
import br.com.sondsp.dtos.survey.SurveyResultOptionDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Converte as opções de resultado de um eixo (catálogo do SurveyPedagogicalLevelService) em entradas de legenda
 * do relatório: sigla curta para a célula e cor.
*/
public final class SurveyReportLegend {

    private static final Map<String, Integer> SEA_COLORS = Map.of(
            "PS", 0xEA9999,
            "SSVC", 0xFFE599,
            "SCVC", 0xF9CB9C,
            "SA", 0xA4C2F4,
            "A", 0xB6D7A8
    );

    /** Siglas dos resultados que não são níveis numerados (as mesmas aceitas por getLevelLabel). */
    private static final Map<String, String> SHORT_CODES = Map.of(
            "ADEQUADA", "AD",
            "INADEQUADA", "IN",
            "NAO_RESPONDEU", "NR",
            "ACERTOU", "AC",
            "ACERTOU_PARCIALMENTE", "AP",
            "ERROU", "ER"
    );

    private static final Pattern LEVEL = Pattern.compile("NIVEL_0*(\\d+)");

    private static final int GRAY = 0xD9D9D9;
    private static final int RED = 0xEA9999;
    private static final int ORANGE = 0xF9CB9C;
    private static final int YELLOW = 0xFFE599;
    private static final int LIGHT_GREEN = 0xD9EAD3;
    private static final int GREEN = 0xB6D7A8;

    /** Escala por quantidade de opções, da pior para a melhor. */
    private static final int[][] SCALES = {
            {},
            { GREEN },
            { RED, GREEN },
            { RED, YELLOW, GREEN },
            { RED, ORANGE, YELLOW, GREEN },
            { RED, ORANGE, YELLOW, LIGHT_GREEN, GREEN },
    };

    private SurveyReportLegend() {}

    public static List<LegendEntry> fromOptions(List<SurveyResultOptionDTO> options) {
        long scaled = options.stream().filter(option -> !isSea(option.value())).count();

        List<LegendEntry> entries = new ArrayList<>();
        int rank = 0;
        for (SurveyResultOptionDTO option : options) {
            String value = option.value();
            int rgb = isSea(value) ? SEA_COLORS.get(normalize(value)) : scaleColor(rank++, (int) scaled);
            entries.add(new LegendEntry(value, shortCode(value), option.label(), rgb));
        }
        return entries;
    }

    /** Sigla curta: "N3" para NIVEL_03, "AC" para ACERTOU, o próprio valor para as hipóteses do SEA. */
    static String shortCode(String value) {
        String key = normalize(value);

        Matcher level = LEVEL.matcher(key);
        if (level.matches()) return "N" + level.group(1);

        String code = SHORT_CODES.get(key);
        if (code != null) return code;

        return key.length() <= 6 ? key : key.substring(0, 6);
    }

    private static boolean isSea(String value) {
        return SEA_COLORS.containsKey(normalize(value));
    }

    private static int scaleColor(int rank, int count) {
        if (count < 1 || count >= SCALES.length) return GRAY;
        return SCALES[count][rank];
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }
}