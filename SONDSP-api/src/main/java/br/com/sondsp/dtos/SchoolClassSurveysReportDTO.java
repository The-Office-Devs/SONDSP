package br.com.sondsp.dtos;

import br.com.sondsp.repositories.projections.SchoolClassSurveysProjection;
import java.util.List;

public record SchoolClassSurveysReportDTO(SchoolClassSurveysProjection header, List<SurveySheet> sheets) {
    public record SurveySheet(
            String name,
            String code,
            String title,
            String subtitle,
            List<String> columns,
            List<LegendEntry> legend,
            List<StudentRow> students
    ) {}

    public record LegendEntry(String value, String code, String description, int rgb) {}

    public record StudentRow(int number, String name, List<String> results) {}
}