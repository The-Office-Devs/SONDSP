package br.com.sondsp.filters;

public record StudentFilter(
        String name,
        String registration,
        Integer schoolClassId,
        String schoolClassName,
        Integer rowNumber,
        Boolean status,
        String search
) {
}
