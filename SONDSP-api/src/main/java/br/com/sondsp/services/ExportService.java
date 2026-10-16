package br.com.sondsp.services;

import br.com.sondsp.dtos.SchoolClassSurveysReportDTO;
import br.com.sondsp.repositories.report.SchoolClassReportRepository;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ExportService {

    private final SchoolClassReportRepository schoolClassReportRepository;

    public Workbook getSchoolClassSurveysReport(SchoolClassSurveysReportDTO data) {
        XSSFWorkbook workbook = schoolClassReportRepository.generateBook();
        schoolClassReportRepository.buildSurveySheets(workbook, data);
        return workbook;
    }
}