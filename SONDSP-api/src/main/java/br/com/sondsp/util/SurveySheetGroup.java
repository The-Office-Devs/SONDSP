package br.com.sondsp.util;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

/**
 * Eixos que o relatório da escola apresenta juntos, numa única aba, em vez de uma aba por eixo.
 *
 * Cada eixo do grupo continua sendo uma sondagem própria (um resultado por aluno, eixo e período); a aba é só o
 * conjunto delas, com uma coluna por eixo dentro de cada período.
 *
 * Os eixos são identificados pelo código (strand.codigo), não pelo id, para não depender da base.
 */
public enum SurveySheetGroup {
    /**
     * "Mapeamento dos Eixos" da Matemática (documento orientador): uma questão por eixo em cada período, com o
     * resultado Errou / Acertou parcialmente / Acertou. A ordem das colunas é a da planilha da escola.
     *
     * Todos os eixos do grupo usam o mesmo catálogo de resultados (SITUACOES_PROBLEMA), por isso a aba tem uma
     * única legenda, obtida pelo primeiro eixo.
     */
    MATH_MAPPING(
            "Mapeamento dos Eixos",
            "RESOLUÇÃO DE PROBLEMAS",
            "MAPEAMENTO DOS EIXOS",
            List.of(
                    new Member("NUMEROS_PROBLEMAS", "Números"),
                    new Member("ALGEBRA", "Álgebra"),
                    new Member("PROBABILIDADE_ESTATISTICA", "Prob. e Estat."),
                    new Member("GEOMETRIA", "Geom."),
                    new Member("GRANDEZAS_MEDIDAS", "Grand. e Med.")
            )
    );

    /** Um eixo do grupo: código do eixo e o rótulo curto do cabeçalho da coluna. */
    public record Member(String strandCode, String label) {}

    private final String sheetName;
    private final String title;
    private final String subtitle;
    private final List<Member> members;

    SurveySheetGroup(String sheetName, String title, String subtitle, List<Member> members) {
        this.sheetName = sheetName;
        this.title = title;
        this.subtitle = subtitle;
        this.members = members;
    }

    /** Nome da aba. */
    public String getSheetName() {
        return sheetName;
    }

    /** Assunto do título: "SONDAGEM DE {title} - CICLO DE ALFABETIZAÇÃO ...". */
    public String getTitle() {
        return title;
    }

    /** Segunda linha do cabeçalho da aba. */
    public String getSubtitle() {
        return subtitle;
    }

    /** Eixos do grupo, na ordem das colunas. */
    public List<Member> getMembers() {
        return members;
    }

    /** Rótulos curtos dos eixos, na ordem das colunas. */
    public List<String> getColumnLabels() {
        return members.stream().map(Member::label).toList();
    }

    /** Código do eixo usado para obter a legenda da aba. */
    public String getLegendStrandCode() {
        return members.get(0).strandCode();
    }

    /** Grupo ao qual o eixo pertence, se pertencer a algum. */
    public static Optional<SurveySheetGroup> fromStrandCode(String strandCode) {
        String key = normalize(strandCode);
        if (key.isEmpty()) return Optional.empty();

        for (SurveySheetGroup group : values()) {
            for (Member member : group.members) {
                if (member.strandCode().equals(key)) return Optional.of(group);
            }
        }
        return Optional.empty();
    }

    /** Mesma normalização usada para comparar códigos de eixo (sem espaços, maiúsculo). */
    public static String normalize(String strandCode) {
        return strandCode == null ? "" : strandCode.trim().toUpperCase(Locale.ROOT);
    }
}