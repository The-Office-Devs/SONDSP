package br.com.sondsp.entities.enums;

public enum EnrollmentStatus {
    CURSANDO,
    CONCLUIDO,
    TRANSFERIDO,
    REMANEJADO;

    public String getLabel() {
        return switch (this) {
            case CURSANDO -> "Cursando";
            case CONCLUIDO -> "Concluído";
            case TRANSFERIDO -> "Transferido";
            case REMANEJADO -> "Remanejado";
        };
    }
}
