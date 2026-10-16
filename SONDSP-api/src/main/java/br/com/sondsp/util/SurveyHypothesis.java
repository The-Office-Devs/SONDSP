package br.com.sondsp.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Optional;

public enum SurveyHypothesis {
    PS("PS", "ESCRITA PRÉ-SILÁBICA", 0xFF, 0x00, 0x00),
    SSVC("SSVC", "ESCRITA SILÁBICA SEM VALOR SONORO CONVENCIONAL", 0xFF, 0xFF, 0x00),
    SCVC("SCVC", "ESCRITA SILÁBICA COM VALOR SONORO CONVENCIONAL", 0xFF, 0x99, 0x00),
    SA("SA", "ESCRITA SILÁBICO-ALFABÉTICA", 0x4A, 0x86, 0xE8),
    A("A", "ESCRITA ALFABÉTICA", 0x6A, 0xA8, 0x4F);

    private final String code;
    private final String description;
    private final byte[] rgb;

    SurveyHypothesis(String code, String description, int r, int g, int b) {
        this.code = code;
        this.description = description;
        this.rgb = new byte[] { (byte) r, (byte) g, (byte) b };
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public byte[] getRgb() {
        return rgb.clone();
    }

    public static Optional<SurveyHypothesis> fromResult(String result) {
        if (result == null || result.isBlank()) return Optional.empty();

        String key = normalize(result);
        for (SurveyHypothesis h : values()) {
            if (normalize(h.code).equals(key) || normalize(h.description).equals(key)) return Optional.of(h);
        }

        return Optional.empty();
    }

    private static String normalize(String value) {
        return Normalizer.normalize(value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("\\s+", " ")
                .toUpperCase(Locale.ROOT);
    }
}