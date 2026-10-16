package br.com.sondsp.entities.enums;

import lombok.Getter;

/**
 * Tipos Oficiais de Instrumentos de Sondagem da SME-SP (COPED/DIEFEM).
 * Define a natureza diagnóstica e a escala avaliativa aplicável.
 */
@Getter
public enum EvaluationType {
    ESCRITA_SEA("Sistema de Escrita Alfabética (SEA)"),
    PRODUCAO_TEXTO("Produção Textual (Convite / Final de Conto)"),
    LEITURA("Práticas de Leitura (Compreensão Leitora)"),
    ESCRITA_NUMEROS("Escrita de Números (Ditado SND)"),
    SITUACOES_PROBLEMA("Resolução de Situações-Problema");

    private final String description;

    EvaluationType(String description) {
        this.description = description;
    }
}
