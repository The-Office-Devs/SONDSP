package br.com.sondsp.entities.enums;

public enum AnnotationTag {
    CONSELHO,
    PEDAGOGICA,
    RESPONSAVEIS;

    public String getLabel() {
        return switch (this) {
            case CONSELHO -> "Conselho";
            case PEDAGOGICA -> "Pedagógica";
            case RESPONSAVEIS -> "Responsáveis";
        };
    }
}
