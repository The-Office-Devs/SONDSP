package br.com.sondsp.imports;

import static br.com.sondsp.util.SystemMessages.*;

import br.com.sondsp.util.DateUtils;
import jakarta.validation.ValidationException;
import java.io.IOException;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class StudentImportParser {
    private static final DataFormatter FORMATTER = new DataFormatter();
    private static final Pattern CODE_AND_NAME = Pattern.compile("^\\s*([^\\s-]+)\\s*-\\s*(.+?)\\s*$");
    private static final Pattern REGISTRATION = Pattern.compile("^\\d{1,10}$");
    private static final int MAX_ERRORS = 10;
    private static final int HEADER_SEARCH_LIMIT = 30;

    public StudentImportFile parse(MultipartFile file) {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            String[] school = codeAndName(valueAfter(sheet, "Unidade"), "Unidade");
            String[] schoolClass = codeAndName(valueAfter(sheet, "Turma"), "Turma");
            String schoolYear = valueAfter(sheet, "Ano Letivo");
            String shift = normalizeShift(valueAfter(sheet, "Turno/Duração"));

            if (schoolYear.isBlank()) throw new ValidationException(String.format(IMPORT_MISSING_HEADER, "Ano Letivo"));
            if (shift.isBlank()) throw new ValidationException(String.format(IMPORT_MISSING_HEADER, "Turno/Duração"));

            List<StudentImportFile.Row> students = new ArrayList<>();
            int ignored = parseStudents(sheet, students);

            if (students.isEmpty()) throw new ValidationException(IMPORT_NO_STUDENTS);

            return new StudentImportFile(
                    school[0], school[1], schoolClass[0], schoolClass[1], schoolYear, shift, students, ignored
            );
        } catch (ValidationException e) {
            throw e;
        } catch (IOException | RuntimeException e) {
            throw new ValidationException(IMPORT_INVALID_FILE);
        }
    }

    private int parseStudents(Sheet sheet, List<StudentImportFile.Row> students) {
        int headerRowIndex = findHeaderRow(sheet);
        Map<String, Integer> columns = mapHeaders(sheet.getRow(headerRowIndex));

        int colRegistration = required(columns, "Código");
        int colRowNumber = required(columns, "Nº");
        int colName = required(columns, "Nome do Aluno");
        int colBirth = required(columns, "Data Nascimento");
        Integer colEntry = columns.get(norm("Data Inclusão Aluno Turma"));
        Integer colStatus = columns.get(norm("Situação Aluno"));

        List<String> errors = new ArrayList<>();
        Set<String> registrations = new HashSet<>();
        Set<Integer> rowNumbers = new HashSet<>();
        int ignored = 0;

        for (int i = headerRowIndex + 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;

            String registration = text(row.getCell(colRegistration));
            String name = text(row.getCell(colName));
            String rowNumberText = text(row.getCell(colRowNumber));

            if (registration.isBlank() && name.isBlank() && rowNumberText.isBlank()) continue;

            if (colStatus != null) {
                String status = text(row.getCell(colStatus));
                if (!status.isBlank() && !"ATIVO".equalsIgnoreCase(status)) {
                    ignored++;
                    continue;
                }
            }

            String line = "Linha " + (i + 1) + ": ";
            List<String> rowErrors = new ArrayList<>();

            if (!REGISTRATION.matcher(registration).matches()) rowErrors.add("matrícula inválida");
            else if (!registrations.add(registration)) rowErrors.add("matrícula repetida na planilha");

            if (name.isBlank()) rowErrors.add("nome vazio");

            Integer rowNumber = null;
            try {
                rowNumber = Integer.valueOf(rowNumberText);
                if (rowNumber <= 0) throw new NumberFormatException();
                if (!rowNumbers.add(rowNumber)) rowErrors.add("número da chamada repetido");
            } catch (NumberFormatException e) {
                rowErrors.add("número da chamada inválido");
            }

            LocalDate birthDate = null;
            try {
                birthDate = date(row.getCell(colBirth));
                if (birthDate == null) rowErrors.add("data de nascimento vazia");
                else if (birthDate.isAfter(DateUtils.today())) rowErrors.add("data de nascimento futura");
            } catch (RuntimeException e) {
                rowErrors.add("data de nascimento inválida");
            }

            LocalDate entryDate = null;
            if (colEntry != null) {
                try {
                    entryDate = date(row.getCell(colEntry));
                } catch (RuntimeException e) {
                    rowErrors.add("data de inclusão na turma inválida");
                }
            }

            if (!rowErrors.isEmpty()) {
                errors.add(line + String.join(", ", rowErrors));
                continue;
            }

            students.add(new StudentImportFile.Row(registration, rowNumber, name, birthDate, entryDate));
        }

        if (!errors.isEmpty()) {
            List<String> shown = errors.subList(0, Math.min(errors.size(), MAX_ERRORS));
            String message = String.join("\n", shown);
            if (errors.size() > MAX_ERRORS) message += "\n... e mais " + (errors.size() - MAX_ERRORS) + " erro(s).";
            throw new ValidationException(String.format(IMPORT_ROW_ERRORS, message));
        }

        return ignored;
    }

    private int findHeaderRow(Sheet sheet) {
        int limit = Math.min(sheet.getLastRowNum(), HEADER_SEARCH_LIMIT);
        for (int i = 0; i <= limit; i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            for (Cell cell : row) {
                if (norm(text(cell)).equals(norm("Nome do Aluno"))) return i;
            }
        }
        throw new ValidationException(String.format(IMPORT_MISSING_HEADER, "Nome do Aluno"));
    }

    private Map<String, Integer> mapHeaders(Row header) {
        Map<String, Integer> map = new HashMap<>();
        for (Cell cell : header) map.putIfAbsent(norm(text(cell)), cell.getColumnIndex());
        return map;
    }

    private int required(Map<String, Integer> columns, String header) {
        Integer index = columns.get(norm(header));
        if (index == null) throw new ValidationException(String.format(IMPORT_MISSING_HEADER, header));
        return index;
    }

    private String valueAfter(Sheet sheet, String label) {
        int limit = Math.min(sheet.getLastRowNum(), HEADER_SEARCH_LIMIT);
        for (int i = 0; i <= limit; i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            for (Cell cell : row) {
                if (norm(text(cell)).equals(norm(label))) return text(row.getCell(cell.getColumnIndex() + 1));
            }
        }
        throw new ValidationException(String.format(IMPORT_MISSING_HEADER, label));
    }

    private String[] codeAndName(String value, String label) {
        Matcher matcher = CODE_AND_NAME.matcher(value);
        if (!matcher.matches()) throw new ValidationException(String.format(IMPORT_MISSING_HEADER, label));
        return new String[] { matcher.group(1), matcher.group(2) };
    }

    /** "Integral 07:00h" -> "Integral" */
    private String normalizeShift(String value) {
        return value.replaceAll("\\s*\\d{1,2}:\\d{2}\\s*h?.*$", "").trim();
    }

    private String text(Cell cell) {
        return cell == null ? "" : FORMATTER.formatCellValue(cell).trim();
    }

    private LocalDate date(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        }
        String value = text(cell);
        return value.isEmpty() ? null : DateUtils.parse(value);
    }

    private String norm(String value) {
        return Normalizer.normalize(value, Normalizer.Form.NFD).replaceAll("\\p{M}", "").trim().toLowerCase();
    }
}