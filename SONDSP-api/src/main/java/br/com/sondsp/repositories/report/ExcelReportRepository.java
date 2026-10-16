package br.com.sondsp.repositories.report;

import lombok.NoArgsConstructor;
import org.springframework.stereotype.Repository;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Repository
@NoArgsConstructor
public abstract class ExcelReportRepository {

    public XSSFWorkbook generateBook() {
        return new XSSFWorkbook();
    }
}
