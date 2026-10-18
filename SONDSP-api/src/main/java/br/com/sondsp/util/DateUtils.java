package br.com.sondsp.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.ResolverStyle;

public final class DateUtils {
    private static final DateTimeFormatter BR_FORMAT =
            DateTimeFormatter.ofPattern("dd/MM/uuuu").withResolverStyle(ResolverStyle.STRICT);

    private DateUtils() {}
    public static LocalDate parse(String value) {
        if (value == null || value.isBlank()) return null;
        return LocalDate.parse(value.trim(), BR_FORMAT);
    }

    public static String format(LocalDate date) {
        return date != null ? date.format(BR_FORMAT) : null;
    }
}