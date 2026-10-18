package br.com.sondsp.dtos;

import br.com.sondsp.repositories.projections.SchoolClassSurveysProjection;
import java.util.List;

public record SchoolClassSurveysReportDTO(SchoolClassSurveysProjection header, List<StrandSheet> sheets) {

    public record StrandSheet(
            Integer strandId,
            String strandName,
            String strandCode,
            List<LegendEntry> legend,
            List<StudentRow> students
    ) {}

    public record LegendEntry(String value, String code, String description, int rgb) {}

    public record StudentRow(int number, String name, List<String> results) {}
}