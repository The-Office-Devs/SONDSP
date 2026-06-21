package br.com.sondsp.filters;

public record SchoolClassFilter(
        String schoolName,
        String name,
        String schoolYear,
        Boolean status,
        String search
) {
}
