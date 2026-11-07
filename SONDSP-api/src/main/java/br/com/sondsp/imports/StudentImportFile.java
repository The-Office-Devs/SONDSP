package br.com.sondsp.imports;

import java.time.LocalDate;
import java.util.List;

public record StudentImportFile(
        String classCode, String className,
        String schoolYear, String shift,
        List<Row> students, int ignored
) {
    public record Row(
            String registration, Integer rowNumber, String name,
            LocalDate birthDate, LocalDate classEntryDate
    ) {}
}