package br.com.sondsp.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public enum SurveyPeriod {
    INITIAL("Sondagem inicial"),
    FIRST("1º Bimestre"),
    SECOND("2º Bimestre"),
    THIRD("3º Bimestre"),
    FOURTH("4º Bimestre");

    private static final Pattern FIRST_DIGIT = Pattern.compile("\\d");

    private final String label;

    SurveyPeriod(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static Optional<SurveyPeriod> fromValue(String value) {
        if (value == null || value.isBlank()) return Optional.empty();

        String key = Normalizer.normalize(value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase(Locale.ROOT);

        if (key.contains("INIC")) return Optional.of(INITIAL);
        if (key.contains("PRIMEIRO")) return Optional.of(FIRST);
        if (key.contains("SEGUNDO")) return Optional.of(SECOND);
        if (key.contains("TERCEIRO")) return Optional.of(THIRD);
        if (key.contains("QUARTO")) return Optional.of(FOURTH);

        Matcher digit = FIRST_DIGIT.matcher(key);
        if (digit.find()) {
            int n = Integer.parseInt(digit.group());
            if (n >= 1 && n <= 4) return Optional.of(values()[n]);
        }
        return Optional.empty();
    }
}