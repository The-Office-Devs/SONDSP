package br.com.sondsp.filters;

public record StudentFilter(
        String name,
        String registration,
        String schoolClassName,
        Integer rowNumber,
        Boolean status,
        String search
) {
}
