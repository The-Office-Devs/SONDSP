package br.com.sondsp.filters;

public record SchoolClassFilter(
        Integer schoolId,
        String schoolName,
        String name,
        String gradeLevel,
        String schoolYear,
        String shift,
        Boolean status,
        String search
) {
}
