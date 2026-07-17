package br.com.sondsp.filters;

public record SchoolClassFilter(
        Integer schoolId,
        String schoolName,
        String name,
        String schoolYear,
        Boolean status,
        String search
) {
}
