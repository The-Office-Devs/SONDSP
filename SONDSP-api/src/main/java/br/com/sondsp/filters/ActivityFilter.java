package br.com.sondsp.filters;

public record ActivityFilter(
        String search,
        String name,
        String subject,
        String strand,
        String schoolYear,
        String bimester,
        String status
) {
}
