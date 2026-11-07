package br.com.sondsp.filters;

public record SchoolClassFilter(
        String name,
        String gradeLevel,
        String schoolYear,
        String shift,
        Integer numStudents,
        Boolean status,
        Boolean hasStudents,
        String search
) {
}
