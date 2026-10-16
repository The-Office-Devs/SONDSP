package br.com.sondsp.entities.enums;

public enum ApplicationPeriod {
    INICIAL,
    PRIMEIRO_BIMESTRE,
    SEGUNDO_BIMESTRE,
    TERCEIRO_BIMESTRE,
    QUARTO_BIMESTRE;

    public String getLabel() {
        return switch (this) {
            case INICIAL -> "Sondagem Inicial";
            case PRIMEIRO_BIMESTRE -> "1º Bimestre";
            case SEGUNDO_BIMESTRE -> "2º Bimestre";
            case TERCEIRO_BIMESTRE -> "3º Bimestre";
            case QUARTO_BIMESTRE -> "4º Bimestre";
        };
    }
}
