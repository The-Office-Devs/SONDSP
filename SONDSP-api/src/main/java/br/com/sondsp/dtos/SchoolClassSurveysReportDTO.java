package br.com.sondsp.dtos;

import br.com.sondsp.repositories.projections.SchoolClassSurveysProjection;
import java.util.List;

public record SchoolClassSurveysReportDTO(SchoolClassSurveysProjection header, List<StrandSheet> sheets) {
    public record StrandSheet(Integer strandId, String strandName, List<StudentRow> students) {}
    public record StudentRow(int number, String name, List<String> results) {}
}