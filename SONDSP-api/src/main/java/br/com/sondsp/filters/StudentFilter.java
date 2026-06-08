package br.com.sondsp.filters;

public record StudentFilter(
        String name,
        String registration,
        Integer schoolClassId,
        Integer rowNumber
) {
}
