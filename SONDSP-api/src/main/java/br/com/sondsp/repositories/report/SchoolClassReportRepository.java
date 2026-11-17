package br.com.sondsp.repositories.report;

import br.com.sondsp.dtos.SchoolClassSurveysReportDTO;
import br.com.sondsp.dtos.SchoolClassSurveysReportDTO.LegendEntry;
import br.com.sondsp.dtos.SchoolClassSurveysReportDTO.StudentRow;
import br.com.sondsp.dtos.SchoolClassSurveysReportDTO.SurveySheet;
import br.com.sondsp.repositories.projections.SchoolClassSurveysProjection;
import br.com.sondsp.util.SurveyPeriod;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.PrintSetup;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.WorkbookUtil;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
public class SchoolClassReportRepository extends ExcelReportRepository {

    private static final Locale PT_BR = Locale.forLanguageTag("pt-BR");

    private static final SurveyPeriod[] PERIODS = SurveyPeriod.values();

    private static final int FIRST_RESULT_COL = 2;

    private static final double INSTRUCTION_CHARS_PER_WIDTH = 85.0 / 133.86;

    private static final double LEGEND_CHARS_PER_WIDTH = 52.0 / 66.57;

    private static final int LOGO_WIDTH_PX = 93;
    private static final int EMU_PER_PIXEL = 9525;

    private static final int MIN_STUDENT_ROWS = 30;

    private static final String LOGO_RESOURCE = "/report/logo-sme.png";

    private static final byte[] GRAY_TITLE = rgb(0xA5, 0xA5, 0xA5);
    private static final byte[] GRAY_BAR = rgb(0x7F, 0x7F, 0x7F);
    private static final byte[] GRAY_NOTE = rgb(0xD9, 0xD9, 0xD9);

    public void buildSurveySheets(XSSFWorkbook wb, SchoolClassSurveysReportDTO data) {
        Styles styles = new Styles(wb);
        int logoIndex = registerLogo(wb);

        for (SurveySheet surveySheet : data.sheets()) {
            buildSheet(wb, styles, logoIndex, data.header(), surveySheet);
        }
    }

    private record Layout(int subCols, int lastCol, int logoCols, int yearStart, double nameWidth, double resultWidth) {
        static Layout of(int columnsPerPeriod) {
            int subCols = Math.max(1, columnsPerPeriod);
            boolean grouped = subCols > 1;
            return new Layout(
                    subCols,
                    FIRST_RESULT_COL + PERIODS.length * subCols - 1,
                    grouped ? subCols : 2, // o logo ocupa o último período (grupo) ou as duas últimas colunas
                    grouped ? FIRST_RESULT_COL + subCols : 3, // onde começa "Ano letivo"
                    grouped ? 40 : 66.57, // com 25 colunas de resultado, o nome precisa ser mais estreito que no modelo
                    grouped ? 6.5 : 12
            );
        }

        boolean grouped() {
            return subCols > 1;
        }

        int infoEnd() {
            return lastCol - logoCols;
        }

        int headerRows() {
            return grouped() ? 2 : 1;
        }

        double totalWidth() {
            return 7.29 + nameWidth + (lastCol - FIRST_RESULT_COL + 1) * resultWidth;
        }
    }

    private void buildSheet(
            XSSFWorkbook wb,
            Styles s,
            int logoIndex,
            SchoolClassSurveysProjection header,
            SurveySheet surveySheet
    ) {
        List<StudentRow> students = surveySheet.students();
        List<LegendEntry> legend = surveySheet.legend();
        List<String> columns = surveySheet.columns() == null ? List.of() : surveySheet.columns();
        Map<String, LegendEntry> legendByValue = legendIndex(legend);
        boolean writing = "ESCRITA".equalsIgnoreCase(nvl(surveySheet.code()).trim());

        Layout layout = Layout.of(columns.size());
        final boolean grouped = layout.grouped();
        final int lastCol = layout.lastCol();
        final int infoEnd = layout.infoEnd();

        String subject = nvl(surveySheet.title()).trim().toUpperCase(PT_BR);
        String subtitle = nvl(surveySheet.subtitle()).isBlank()
                ? (writing ? "HIPÓTESES DE " : "RESULTADOS DE ") + subject
                : surveySheet.subtitle().trim().toUpperCase(PT_BR);
        String gradeYear = nvl(header.getGradeLevel()).replaceAll("\\D", "");

        XSSFSheet sheet = wb.createSheet(uniqueSheetName(wb, nvl(surveySheet.name()).trim()));

        // ---- Linha 1 e 2: títulos -------------------------------------------------------------
        Row row = newRow(sheet, 0, 22.5f);
        fill(row, 0, lastCol, s.title);
        row.getCell(0).setCellValue(
                "SONDAGEM DE " + subject + " - CICLO DE ALFABETIZAÇÃO" + (gradeYear.isEmpty() ? "" : " - " + gradeYear + "º ANO")
        );
        merge(sheet, 0, 0, 0, lastCol);

        row = newRow(sheet, 1, 21f);
        fill(row, 0, lastCol, s.title);
        row.getCell(0).setCellValue(subtitle);
        merge(sheet, 1, 1, 0, lastCol);

        // ---- Linhas 3 a 5: escola, professor, turma / ano letivo (+ logo à direita) ------------
        row = newRow(sheet, 2, 23.25f);
        fill(row, 0, lastCol, s.info);
        row.getCell(0).setCellValue(labelValue(s, "Nome da Escola:", "EMEF - LINO DE MATTOS, SEN."));
        merge(sheet, 2, 2, 0, infoEnd);

        row = newRow(sheet, 3, 27f);
        fill(row, 0, lastCol, s.info);
        row.getCell(0).setCellValue(labelValue(s, "Professor(a):", header.getTeacher()));
        merge(sheet, 3, 3, 0, infoEnd);

        row = newRow(sheet, 4, 24.75f);
        fill(row, 0, lastCol, s.info);
        row.getCell(0).setCellValue(labelValue(s, "Turma:", header.getSchoolClass()));
        merge(sheet, 4, 4, 0, layout.yearStart() - 1);
        row.getCell(layout.yearStart()).setCellValue(labelValue(s, "Ano letivo:", header.getSchoolYear()));
        merge(sheet, 4, 4, layout.yearStart(), infoEnd);

        merge(sheet, 2, 4, infoEnd + 1, lastCol); // espaço do logo

        // ---- Linha 6: faixa cinza ----------------------------------------------------------------
        row = newRow(sheet, 5, 15.75f);
        fill(row, 0, lastCol, s.bar);
        merge(sheet, 5, 5, 0, lastCol);

        // ---- Linha 7: instrução --------------------------------------------------------------------
        XSSFRichTextString instruction = instructionText(s, legend, writing, grouped);
        double charsPerLine = layout.totalWidth() * INSTRUCTION_CHARS_PER_WIDTH;
        float instructionHeight = Math.max(43.5f, (float) Math.ceil(instruction.length() / charsPerLine) * 19f);
        row = newRow(sheet, 6, instructionHeight);
        fill(row, 0, lastCol, s.instruction);
        row.getCell(0).setCellValue(instruction);
        merge(sheet, 6, 6, 0, lastCol);

        // ---- Cabeçalho da tabela: 1 linha (um eixo) ou 2 linhas (período em cima, eixo embaixo) -----
        final int headerFirst = 7;
        final int headerLast = headerFirst + layout.headerRows() - 1;

        Row headerTop = newRow(sheet, headerFirst, grouped ? 18f : 15.75f);
        Row headerBottom = grouped ? newRow(sheet, headerLast, 26f) : headerTop;

        for (int c = 0; c < FIRST_RESULT_COL; c++) {
            Cell cell = headerTop.createCell(c);
            cell.setCellValue(c == 0 ? "Nº" : "Nome");
            cell.setCellStyle(s.headerBig);
            if (grouped) headerBottom.createCell(c).setCellStyle(s.headerBig);
        }
        for (int p = 0; p < PERIODS.length; p++) {
            int start = FIRST_RESULT_COL + p * layout.subCols();
            for (int k = 0; k < layout.subCols(); k++) {
                Cell cell = headerTop.createCell(start + k);
                cell.setCellStyle(grouped ? s.headerBig : s.headerSmall);
                if (k == 0) cell.setCellValue(PERIODS[p].getLabel());

                if (grouped) {
                    Cell axis = headerBottom.createCell(start + k);
                    axis.setCellValue(columns.get(k));
                    axis.setCellStyle(s.headerSmall);
                }
            }
            merge(sheet, headerFirst, headerFirst, start, start + layout.subCols() - 1);
        }
        if (grouped) {
            merge(sheet, headerFirst, headerLast, 0, 0);
            merge(sheet, headerFirst, headerLast, 1, 1);
        }

        // ---- Alunos -----------------------------------------------------------------------------------
        final int firstStudentRow = headerLast + 1;
        final int totalRows = Math.max(students.size(), MIN_STUDENT_ROWS);
        final int lastStudentRow = firstStudentRow + totalRows - 1;

        for (int i = 0; i < totalRows; i++) {
            row = newRow(sheet, firstStudentRow + i, 15.75f);

            Cell number = row.createCell(0);
            number.setCellValue(i + 1);
            number.setCellStyle(s.rowNumber);

            Cell name = row.createCell(1);
            name.setCellStyle(s.rowName);

            StudentRow student = i < students.size() ? students.get(i) : null;
            if (student != null) name.setCellValue(nvl(student.name()));

            for (int c = FIRST_RESULT_COL; c <= lastCol; c++) {
                Cell cell = row.createCell(c);
                cell.setCellStyle(s.rowResult);

                String result = student == null ? null : valueAt(student.results(), c - FIRST_RESULT_COL);
                if (result == null || result.isBlank()) continue;

                LegendEntry entry = legendByValue.get(result.trim().toUpperCase(Locale.ROOT));
                if (entry != null) {
                    cell.setCellValue(entry.code());
                    cell.setCellStyle(s.resultStyle(entry.rgb()));
                } else {
                    cell.setCellValue(result.trim());
                }
            }
        }

        // ---- Legenda -------------------------------------------------------
        int lastRow = lastStudentRow;

        if (!legend.isEmpty()) {
            final int legendRow = lastStudentRow + 2;
            final int legendEnd = legendRow + legend.size();
            lastRow = legendEnd;

            for (int r = legendRow; r <= legendEnd; r++) newRow(sheet, r, 15.75f);

            Row legendTitle = sheet.getRow(legendRow);
            fill(legendTitle, 0, 1, s.legendTitle);
            legendTitle.getCell(0).setCellValue("LEGENDA:");
            merge(sheet, legendRow, legendRow, 0, 1);

            for (int r = legendRow; r <= legendEnd; r++) fill(sheet.getRow(r), 2, lastCol, s.legendNote);
            sheet.getRow(legendRow).getCell(2).setCellValue(
                    "Atenção: Verificar no Documento Orientador de Sondagens a definição de cada " + (writing ? "hipótese" : "resultado")
            );
            merge(sheet, legendRow, legendEnd, 2, lastCol);

            int r = legendRow + 1;
            for (LegendEntry entry : legend) {
                Row legendLine = sheet.getRow(r++);
                legendLine.setHeightInPoints(legendLineHeight(entry.description(), layout.nameWidth()));

                CellStyle legendStyle = s.legendStyle(entry.rgb());
                Cell code = legendLine.createCell(0);
                code.setCellValue(entry.code());
                code.setCellStyle(legendStyle);
                Cell description = legendLine.createCell(1);
                description.setCellValue(nvl(entry.description()));
                description.setCellStyle(legendStyle);
            }

            s.outline(sheet, legendRow, legendRow, 0, 1);
            s.outline(sheet, legendRow, legendEnd, 2, lastCol);
            s.outline(sheet, legendRow + 1, legendEnd, 0, 1);
        }

        // ---- Bordas externas  ----------------------------------------
        s.outline(sheet, 0, lastRow, 0, lastCol);
        s.outline(sheet, 0, 1, 0, lastCol);
        s.outline(sheet, 2, 4, 0, lastCol);
        s.outline(sheet, 2, 4, infoEnd + 1, lastCol);
        s.outline(sheet, 6, 6, 0, lastCol);
        s.outline(sheet, headerFirst, headerLast, 0, lastCol);
        s.outline(sheet, firstStudentRow, lastStudentRow, 0, lastCol);

        if (grouped) {
            for (int p = 0; p < PERIODS.length; p++) {
                int start = FIRST_RESULT_COL + p * layout.subCols();
                s.outline(sheet, headerFirst, lastStudentRow, start, start + layout.subCols() - 1);
            }
        }

        // ---- Larguras, logo e impressão ------------------------------------------------------------------
        sheet.setColumnWidth(0, width(7.29));
        sheet.setColumnWidth(1, width(layout.nameWidth()));
        for (int c = FIRST_RESULT_COL; c <= lastCol; c++) sheet.setColumnWidth(c, width(layout.resultWidth()));

        addLogo(wb, sheet, logoIndex, layout);

        sheet.setFitToPage(true);
        PrintSetup print = sheet.getPrintSetup();
        print.setPaperSize(PrintSetup.A4_PAPERSIZE);
        print.setLandscape(grouped);
        print.setFitWidth((short) 1);
        print.setFitHeight((short) 0);
        wb.setPrintArea(wb.getSheetIndex(sheet), 0, lastCol, 0, lastRow);
    }

    // =====================================================================================================
    // Helpers
    // =====================================================================================================

    private static Row newRow(XSSFSheet sheet, int index, float heightInPoints) {
        Row row = sheet.createRow(index);
        row.setHeightInPoints(heightInPoints);
        return row;
    }

    /** Cria as células [from..to] da linha com o estilo, para o fundo/borda aparecerem nas áreas mescladas. */
    private static void fill(Row row, int from, int to, CellStyle style) {
        for (int c = from; c <= to; c++) row.createCell(c).setCellStyle(style);
    }

    private static void merge(XSSFSheet sheet, int firstRow, int lastRow, int firstCol, int lastCol) {
        if (firstRow == lastRow && firstCol == lastCol) return;
        sheet.addMergedRegion(new CellRangeAddress(firstRow, lastRow, firstCol, lastCol));
    }

    private static int width(double chars) {
        return (int) Math.round(chars * 256);
    }

    private static int pixels(double chars) {
        return (int) Math.round(chars * 7 + 5);
    }

    private static byte[] rgb(int r, int g, int b) {
        return new byte[] { (byte) r, (byte) g, (byte) b };
    }

    private static String nvl(String value) {
        return value == null ? "" : value;
    }

    private static String valueAt(List<String> values, int index) {
        return values != null && index < values.size() ? values.get(index) : null;
    }

    /** "Rótulo: valor", com o rótulo em negrito. */
    private static XSSFRichTextString labelValue(Styles s, String label, String value) {
        String text = label + " " + nvl(value).trim();
        XSSFRichTextString rich = new XSSFRichTextString(text);
        rich.applyFont(0, label.length(), s.bold11);
        rich.applyFont(label.length(), text.length(), s.normal11);
        return rich;
    }

    /** Valor gravado no banco (maiúsculo) -> entrada da legenda do eixo. */
    private static Map<String, LegendEntry> legendIndex(List<LegendEntry> legend) {
        Map<String, LegendEntry> index = new HashMap<>();
        for (LegendEntry entry : legend) index.put(nvl(entry.value()).trim().toUpperCase(Locale.ROOT), entry);
        return index;
    }

    /** Altura da linha da legenda: cresce quando a descrição não cabe em uma linha da coluna B. */
    private static float legendLineHeight(String description, double nameWidth) {
        int lines = Math.max(1, (int) Math.ceil(nvl(description).length() / (nameWidth * LEGEND_CHARS_PER_WIDTH)));
        return lines == 1 ? 15.75f : lines * 15f + 1.5f;
    }

    /**
     * Texto de instrução com as siglas da legenda do eixo em negrito. Para o eixo ESCRITA mantém a redação do
     * modelo; para os demais, uma redação neutra (e, na aba de grupo, "em cada eixo").
     */
    private static XSSFRichTextString instructionText(Styles s, List<LegendEntry> legend, boolean writing, boolean perAxis) {
        String subject = writing
                ? "a hipótese que melhor representa a escrita apresentada pelo estudante"
                : "o resultado que melhor representa o desempenho apresentado pelo estudante" + (perAxis ? " em cada eixo" : "");
        String ending = "conforme documento orientador de sondagem.";

        List<String> parts = new ArrayList<>();
        List<Boolean> bold = new ArrayList<>();

        if (legend.isEmpty()) {
            parts.add("Anote " + subject + ", " + ending);
            bold.add(false);
        } else {
            parts.add("Anote  ");
            bold.add(false);
            for (int i = 0; i < legend.size(); i++) {
                if (i > 0) {
                    parts.add(i == legend.size() - 1 ? " ou " : ", ");
                    bold.add(false);
                }
                parts.add(legend.get(i).code());
                bold.add(true);
            }
            parts.add(", ou utilize as cores da legenda, para indicar " + subject + ", " + ending);
            bold.add(false);
        }

        StringBuilder text = new StringBuilder();
        for (String part : parts) text.append(part);

        XSSFRichTextString rich = new XSSFRichTextString(text.toString());
        int start = 0;
        for (int i = 0; i < parts.size(); i++) {
            int end = start + parts.get(i).length();
            rich.applyFont(start, end, bold.get(i) ? s.bold14 : s.normal14);
            start = end;
        }
        return rich;
    }

    /** Nome de aba válido (até 31 caracteres, sem caracteres proibidos) e único no workbook. */
    private static String uniqueSheetName(XSSFWorkbook wb, String proposal) {
        String base = WorkbookUtil.createSafeSheetName(proposal.isBlank() ? "Eixo" : proposal);
        String name = base;
        int n = 2;
        while (wb.getSheet(name) != null) {
            String suffix = " (" + n++ + ")";
            name = base.substring(0, Math.min(base.length(), 31 - suffix.length())) + suffix;
        }
        return name;
    }

    /** Adiciona a imagem do logo ao workbook uma única vez. Retorna -1 se não for possível (relatório sai sem logo). */
    private int registerLogo(XSSFWorkbook wb) {
        try (InputStream in = SchoolClassReportRepository.class.getResourceAsStream(LOGO_RESOURCE)) {
            if (in == null) {
                log.warn("Logo {} não encontrado no classpath; relatório gerado sem logo.", LOGO_RESOURCE);
                return -1;
            }
            return wb.addPicture(in.readAllBytes(), Workbook.PICTURE_TYPE_PNG);
        } catch (IOException | RuntimeException e) {
            log.warn("Não foi possível carregar o logo do relatório de sondagem.", e);
            return -1;
        }
    }

    /**
     * Posiciona o logo no canto direito, no espaço reservado para ele (mesmo tamanho do modelo). Na aba de um eixo
     * usa a posição do modelo; na aba de grupo, centraliza no último período.
     */
    private void addLogo(XSSFWorkbook wb, XSSFSheet sheet, int pictureIndex, Layout layout) {
        if (pictureIndex < 0) return;
        try {
            int col = layout.infoEnd() + 1;
            int dx = 333375;
            if (layout.grouped()) {
                int colPx = pixels(layout.resultWidth());
                int blockPx = colPx * layout.subCols();
                col = layout.infoEnd() + 2;
                dx = Math.max(0, (blockPx - LOGO_WIDTH_PX) / 2 - colPx) * EMU_PER_PIXEL;
            }

            CreationHelper helper = wb.getCreationHelper();
            ClientAnchor anchor = helper.createClientAnchor();
            anchor.setCol1(col);
            anchor.setRow1(3); // linha 4
            anchor.setDx1(dx);
            anchor.setDy1(9525);
            anchor.setAnchorType(ClientAnchor.AnchorType.DONT_MOVE_AND_RESIZE);

            Picture picture = sheet.createDrawingPatriarch().createPicture(anchor, pictureIndex);
            picture.resize(93.0 / 212.0, 38.0 / 80.0);
        } catch (RuntimeException e) {
            log.warn("Não foi possível inserir o logo no relatório de sondagem.", e);
        }
    }

    // =====================================================================================================
    // Estilos
    // =====================================================================================================

    private static final class Styles {

        final XSSFFont normal11;
        final XSSFFont bold11;
        final XSSFFont normal14;
        final XSSFFont bold14;

        final CellStyle title;
        final CellStyle info;
        final CellStyle bar;
        final CellStyle instruction;
        final CellStyle headerBig;
        final CellStyle headerSmall;
        final CellStyle rowNumber;
        final CellStyle rowName;
        final CellStyle rowResult;
        final CellStyle legendTitle;
        final CellStyle legendNote;
        final XSSFFont boldArial;

        private final XSSFWorkbook wb;
        private final Map<Integer, CellStyle> resultStyles = new HashMap<>();
        private final Map<Integer, CellStyle> legendStyles = new HashMap<>();
        private final Map<String, XSSFCellStyle> outlineCache = new HashMap<>();

        Styles(XSSFWorkbook wb) {
            this.wb = wb;
            normal11 = font(wb, "Calibri", 11, false);
            bold11 = font(wb, "Calibri", 11, true);
            normal14 = font(wb, "Calibri", 14, false);
            bold14 = font(wb, "Calibri", 14, true);
            XSSFFont bold8 = font(wb, "Calibri", 8, true);
            boldArial = font(wb, "Arial", 11, true);
            XSSFFont title14 = font(wb, "Calibri", 14, true);

            BorderStyle thin = BorderStyle.THIN;
            BorderStyle none = BorderStyle.NONE;
            HorizontalAlignment center = HorizontalAlignment.CENTER;
            HorizontalAlignment left = HorizontalAlignment.LEFT;
            VerticalAlignment middle = VerticalAlignment.CENTER;

            title = style(wb, title14, center, middle, false, thin, GRAY_TITLE);
            info = style(wb, normal11, left, middle, false, thin, null);
            bar = style(wb, normal11, center, middle, false, thin, GRAY_BAR);
            instruction = style(wb, normal14, left, middle, true, none, null);
            headerBig = style(wb, bold11, center, middle, false, thin, null);
            headerSmall = style(wb, bold8, center, middle, true, thin, null);
            rowNumber = style(wb, normal11, center, middle, false, thin, null);
            rowName = style(wb, normal11, left, middle, false, thin, null);
            rowResult = style(wb, bold11, center, middle, false, thin, null);
            legendTitle = style(wb, boldArial, center, middle, false, thin, null);
            legendNote = style(wb, normal11, center, middle, true, thin, GRAY_NOTE);
        }

        CellStyle resultStyle(int rgb) {
            return resultStyles.computeIfAbsent(
                    rgb,
                    k -> style(wb, bold11, HorizontalAlignment.CENTER, VerticalAlignment.CENTER, false, BorderStyle.THIN, toBytes(k))
            );
        }

        CellStyle legendStyle(int rgb) {
            return legendStyles.computeIfAbsent(
                    rgb,
                    k -> style(wb, boldArial, HorizontalAlignment.CENTER, VerticalAlignment.CENTER, true, BorderStyle.THIN, toBytes(k))
            );
        }

        private static byte[] toBytes(int rgb) {
            return new byte[] { (byte) (rgb >> 16), (byte) (rgb >> 8), (byte) rgb };
        }

        void outline(XSSFSheet sheet, int firstRow, int lastRow, int firstCol, int lastCol) {
            for (int r = firstRow; r <= lastRow; r++) {
                Row row = sheet.getRow(r) != null ? sheet.getRow(r) : sheet.createRow(r);
                for (int c = firstCol; c <= lastCol; c++) {
                    boolean top = r == firstRow;
                    boolean bottom = r == lastRow;
                    boolean left = c == firstCol;
                    boolean right = c == lastCol;
                    if (!(top || bottom || left || right)) continue; // miolo: nada a fazer

                    Cell cell = row.getCell(c) != null ? row.getCell(c) : row.createCell(c);
                    XSSFCellStyle base = (XSSFCellStyle) cell.getCellStyle();

                    String key = base.getIndex() + ":" + top + bottom + left + right;
                    XSSFCellStyle styled = outlineCache.get(key);
                    if (styled == null) {
                        styled = wb.createCellStyle();
                        styled.cloneStyleFrom(base);
                        if (top) styled.setBorderTop(BorderStyle.MEDIUM);
                        if (bottom) styled.setBorderBottom(BorderStyle.MEDIUM);
                        if (left) styled.setBorderLeft(BorderStyle.MEDIUM);
                        if (right) styled.setBorderRight(BorderStyle.MEDIUM);
                        outlineCache.put(key, styled);
                    }
                    cell.setCellStyle(styled);
                }
            }
        }

        private static XSSFFont font(XSSFWorkbook wb, String name, int size, boolean bold) {
            XSSFFont font = wb.createFont();
            font.setFontName(name);
            font.setFontHeightInPoints((short) size);
            font.setBold(bold);
            font.setColor(IndexedColors.BLACK.getIndex());
            return font;
        }

        private static XSSFCellStyle style(
                XSSFWorkbook wb,
                Font font,
                HorizontalAlignment horizontal,
                VerticalAlignment vertical,
                boolean wrap,
                BorderStyle border,
                byte[] fillRgb
        ) {
            XSSFCellStyle style = wb.createCellStyle();
            style.setFont(font);
            style.setAlignment(horizontal);
            style.setVerticalAlignment(vertical);
            style.setWrapText(wrap);
            style.setBorderTop(border);
            style.setBorderBottom(border);
            style.setBorderLeft(border);
            style.setBorderRight(border);
            if (fillRgb != null) {
                style.setFillForegroundColor(new XSSFColor(fillRgb, null));
                style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            }
            return style;
        }
    }
}