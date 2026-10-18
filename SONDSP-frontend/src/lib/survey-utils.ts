import type { LearningTrajectoryResults, TrajectoryLevel } from "@/learning-trajectories/learning-trajectories.types";
import { resultOptions } from "./options-utils";

/**
 * Legenda padrão oficial da SME-SP para hipóteses do Sistema de Escrita Alfabética (SEA).
 */
export const LEGEND: SurveyResultCode[] = ["PS", "SSVC", "SCVC", "SA", "A"];

export type SurveyResultCode =
  | "PS"
  | "SSVC"
  | "SCVC"
  | "SA"
  | "A"
  | "NIVEL_01"
  | "NIVEL_02"
  | "NIVEL_03"
  | "NIVEL_04"
  | "NIVEL_05"
  | "N1"
  | "N2"
  | "N3"
  | "N4"
  | "N5"
  | "ADEQUADA"
  | "INADEQUADA"
  | "NAO_RESPONDEU"
  | "AD"
  | "IN"
  | "NR"
  | "ACERTOU"
  | "ACERTOU_PARCIALMENTE"
  | "ERROU"
  | string;

export const NO_RESULT_DOT_CLASS = "bg-slate-300";

export const RESULT_DOT_CLASS: Record<string, string> = {
  // Hipóteses do Sistema de Escrita Alfabética - SEA (Diretrizes SME-SP)
  PS: "bg-red-600",
  SSVC: "bg-yellow-400",
  SCVC: "bg-orange-500",
  SA: "bg-blue-600",
  A: "bg-emerald-600",

  // Níveis Numéricos (Ditado SND) e Produção Textual (Saeb 743)
  NIVEL_01: "bg-red-500",
  NIVEL_02: "bg-amber-500",
  NIVEL_03: "bg-sky-600",
  NIVEL_04: "bg-emerald-600",
  NIVEL_05: "bg-purple-600",
  N1: "bg-red-500",
  N2: "bg-amber-500",
  N3: "bg-sky-600",
  N4: "bg-emerald-600",
  N5: "bg-purple-600",

  // Práticas de Leitura (Compreensão Leitora)
  ADEQUADA: "bg-emerald-600",
  AD: "bg-emerald-600",
  INADEQUADA: "bg-amber-500",
  IN: "bg-amber-500",
  NAO_RESPONDEU: "bg-slate-400",
  NR: "bg-slate-400",

  // Eixos Estruturantes da Matemática (Situações-Problema)
  ACERTOU: "bg-emerald-600",
  AC: "bg-emerald-600",
  ACERTOU_PARCIALMENTE: "bg-amber-500",
  AP: "bg-amber-500",
  ERROU: "bg-red-600",
  ER: "bg-red-600"
};

export interface SurveyLevelStyle {
  bg: string;
  text: string;
}

/**
 * Mapeamento estrito de cores e contrastes alinhado às Diretrizes da SME-SP.
 * Mantém classes literais do Tailwind CSS para garantir compilação no build.
 */
export const LEVEL_STYLE_MAP: Record<string, SurveyLevelStyle> = {
  // Hipóteses do Sistema de Escrita Alfabética - SEA (1º Ano e casos excepcionais)
  PS: { bg: "bg-red-600", text: "text-white" },
  SSVC: { bg: "bg-yellow-400", text: "text-slate-900" },
  SCVC: { bg: "bg-orange-500", text: "text-white" },
  SA: { bg: "bg-blue-600", text: "text-white" },
  A: { bg: "bg-emerald-600", text: "text-white" },

  // Níveis Numéricos (Ditado SND - SME-SP) e Produção de Texto (Saeb 743 - Níveis 01 a 04)
  NIVEL_01: { bg: "bg-red-500", text: "text-white" },
  NIVEL_02: { bg: "bg-amber-500", text: "text-white" },
  NIVEL_03: { bg: "bg-sky-600", text: "text-white" },
  NIVEL_04: { bg: "bg-emerald-600", text: "text-white" },
  NIVEL_05: { bg: "bg-purple-600", text: "text-white" },

  // Códigos Abreviados para Nós e Badges Reduzidos (ex: N1..N5)
  N1: { bg: "bg-red-500", text: "text-white" },
  N2: { bg: "bg-amber-500", text: "text-white" },
  N3: { bg: "bg-sky-600", text: "text-white" },
  N4: { bg: "bg-emerald-600", text: "text-white" },
  N5: { bg: "bg-purple-600", text: "text-white" },

  // Práticas de Leitura (Compreensão Leitora)
  AD: { bg: "bg-emerald-600", text: "text-white" },
  ADEQUADA: { bg: "bg-emerald-600", text: "text-white" },
  IN: { bg: "bg-amber-500", text: "text-white" },
  INAD: { bg: "bg-amber-500", text: "text-white" },
  INADEQUADA: { bg: "bg-amber-500", text: "text-white" },
  NR: { bg: "bg-slate-400", text: "text-white" },
  NAO_RESPONDEU: { bg: "bg-slate-400", text: "text-white" },

  // Eixos Estruturantes da Matemática (Situações-Problema)
  "4/4": { bg: "bg-emerald-600", text: "text-white" },
  "3/4": { bg: "bg-indigo-600", text: "text-white" },
  "2/4": { bg: "bg-amber-500", text: "text-white" },
  "1/4": { bg: "bg-orange-500", text: "text-white" },
  "0/4": { bg: "bg-red-600", text: "text-white" },
  AC: { bg: "bg-emerald-600", text: "text-white" },
  ACERTOU: { bg: "bg-emerald-600", text: "text-white" },
  AP: { bg: "bg-amber-500", text: "text-white" },
  ACERTOU_PARCIALMENTE: { bg: "bg-amber-500", text: "text-white" },
  ER: { bg: "bg-red-600", text: "text-white" },
  ERROU: { bg: "bg-red-600", text: "text-white" }
};

export const DEFAULT_LEVEL_STYLE: SurveyLevelStyle = {
  bg: "bg-slate-500",
  text: "text-white"
};

/**
 * Retorna as classes CSS de background e texto para um determinado código de resultado da sondagem.
 */
export function getSurveyLevelStyle(code?: string | null): SurveyLevelStyle {
  if (!code) return DEFAULT_LEVEL_STYLE;
  const normalized = code.trim().toUpperCase();
  return LEVEL_STYLE_MAP[normalized] ?? DEFAULT_LEVEL_STYLE;
}

/**
 * Retorna a classe de cor de fundo do ponto indicador (dot) para o painel de turmas.
 */
export function getSurveyDotClass(code?: string | null): string {
  if (!code) return NO_RESULT_DOT_CLASS;
  const normalized = code.trim().toUpperCase();
  return RESULT_DOT_CLASS[normalized] ?? LEVEL_STYLE_MAP[normalized]?.bg ?? NO_RESULT_DOT_CLASS;
}

/**
 * Abrevia o código de nível para caber confortavelmente em badges circulares da linha do tempo.
 * Converte palavras longas em siglas pedagógicas oficiais (Diretrizes SME-SP):
 * "ADEQUADA" -> "AD", "INADEQUADA" -> "IN", "NAO_RESPONDEU" -> "NR",
 * "NIVEL_01" -> "N1", "ACERTOU" -> "AC", etc.
 */
export function getBadgeLevelCode(code?: string | null): string {
  if (!code) return "";
  const normalized = code.trim().toUpperCase();

  // Práticas de Leitura
  if (normalized === "ADEQUADA" || normalized === "AD") return "AD";
  if (normalized === "INADEQUADA" || normalized === "IN") return "IN";
  if (normalized === "NAO_RESPONDEU" || normalized === "NR") return "NR";

  // Situações-Problema de Matemática
  if (normalized === "ACERTOU" || normalized === "AC") return "AC";
  if (normalized === "ACERTOU_PARCIALMENTE" || normalized === "AP") return "AP";
  if (normalized === "ERROU" || normalized === "ER") return "ER";

  // Níveis Numéricos (SND) e Produção de Texto (Saeb 743)
  if (normalized.startsWith("NIVEL_")) {
    return normalized.replace("NIVEL_0", "N").replace("NIVEL_", "N");
  }

  return normalized;
}

export interface EnrollmentBadgeStyle {
  label: string;
  className: string;
}

/**
 * Mapeia o status da matrícula escolar para rótulo legível e classes CSS do Tailwind.
 */
export function getEnrollmentStatusBadge(status?: string | null): EnrollmentBadgeStyle {
  switch (status?.toUpperCase()) {
    case "CURSANDO":
      return {
        label: "Cursando",
        className: "bg-emerald-100 text-emerald-700 font-semibold"
      };
    case "CONCLUIDO":
      return {
        label: "Concluído",
        className: "bg-slate-200 text-slate-600 font-medium"
      };
    case "TRANSFERIDO":
      return {
        label: "Transferido",
        className: "bg-amber-100 text-amber-700 font-medium"
      };
    case "REMANEJADO":
      return {
        label: "Remanejado",
        className: "bg-blue-100 text-blue-700 font-medium"
      };
    default:
      return {
        label: status || "—",
        className: "bg-slate-100 text-slate-600 font-medium"
      };
  }
}

export function getResultLabel(code?: string | null) {
  if (!code) return "Sem sondagem";
  return resultOptions.find((option) => option.value === code)?.label ?? code;
}

export function isKnownLevel(level: TrajectoryLevel): level is SurveyResultCode {
  return !!level && level in RESULT_DOT_CLASS;
}

export function getCurrentLevel(results: LearningTrajectoryResults): TrajectoryLevel {
  const periods = [results.initial, results.fstPeriod, results.sndPeriod, results.trdPeriod, results.frtPeriod];
  return [...periods].reverse().find(isKnownLevel) ?? null;
}

export interface LegendItem {
  code: string;
  label: string;
  dotClass: string;
}

export const SEA_LEGEND_ITEMS: LegendItem[] = [
  { code: "PS", label: "Pré-Silábica (PS)", dotClass: "bg-red-600" },
  { code: "SSVC", label: "Silábica Sem Valor Sonoro (SSVC)", dotClass: "bg-yellow-400" },
  { code: "SCVC", label: "Silábica Com Valor Sonoro (SCVC)", dotClass: "bg-orange-500" },
  { code: "SA", label: "Silábico-Alfabética (SA)", dotClass: "bg-blue-600" },
  { code: "A", label: "Alfabética (A)", dotClass: "bg-emerald-600" }
];

export const NUMERIC_LEGEND_ITEMS: LegendItem[] = [
  { code: "N1", label: "Nível 1 (N1)", dotClass: "bg-red-500" },
  { code: "N2", label: "Nível 2 (N2)", dotClass: "bg-amber-500" },
  { code: "N3", label: "Nível 3 (N3)", dotClass: "bg-sky-600" },
  { code: "N4", label: "Nível 4 (N4)", dotClass: "bg-emerald-600" },
  { code: "N5", label: "Nível 5 (N5)", dotClass: "bg-purple-600" }
];

export const READING_LEGEND_ITEMS: LegendItem[] = [
  { code: "AD", label: "Compreensão Adequada (AD)", dotClass: "bg-emerald-600" },
  { code: "IN", label: "Compreensão Inadequada (IN)", dotClass: "bg-amber-500" },
  { code: "NR", label: "Não Respondeu (NR)", dotClass: "bg-slate-400" }
];

export const MATH_PROBLEM_LEGEND_ITEMS: LegendItem[] = [
  { code: "AC", label: "Acertou (AC)", dotClass: "bg-emerald-600" },
  { code: "AP", label: "Acertou Parcialmente (AP)", dotClass: "bg-amber-500" },
  { code: "ER", label: "Errou (ER)", dotClass: "bg-red-600" }
];

/**
 * Retorna a legenda pedagógica oficial aplicável a um conjunto de resultados ou código de eixo.
 * Compartilhada entre todos os cards de listagem e visualização da turma.
 */
export function getActiveLegend(
  results: (string | null | undefined)[],
  strandCode?: string
): LegendItem[] {
  const strand = String(strandCode ?? "").trim().toUpperCase();

  switch (strand) {
    case "SITUACOES_PROBLEMA":
    case "NUMEROS_PROBLEMAS":
    case "ALGEBRA":
    case "GEOMETRIA":
    case "GRANDEZAS_MEDIDAS":
    case "PROBABILIDADE_ESTATISTICA":
      return MATH_PROBLEM_LEGEND_ITEMS;
    case "ESCRITA_NUMEROS":
      return NUMERIC_LEGEND_ITEMS;
    case "LEITURA":
      return READING_LEGEND_ITEMS;
    case "ESCRITA": {
      const hasNumeric = results.some((r) => r && r.toUpperCase().startsWith("NIVEL_"));
      return hasNumeric ? NUMERIC_LEGEND_ITEMS : SEA_LEGEND_ITEMS;
    }
  }

  // Se não foi fornecido código canônico de eixo explícito, discrimina com base nos códigos presentes nos resultados avaliados
  const canonicalResults = results
    .filter((r): r is string => Boolean(r && r.trim()))
    .map((r) => r.trim().toUpperCase());

  const hasReading = canonicalResults.some(
    (r) => r === "AD" || r === "IN" || r === "NR" || r === "ADEQUADA" || r === "INADEQUADA" || r === "NAO_RESPONDEU"
  );
  if (hasReading) return READING_LEGEND_ITEMS;

  const hasMathProblems = canonicalResults.some(
    (r) => r === "AC" || r === "AP" || r === "ER" || r === "ACERTOU" || r === "ACERTOU_PARCIALMENTE" || r === "ERROU"
  );
  if (hasMathProblems) return MATH_PROBLEM_LEGEND_ITEMS;

  const hasNumeric = canonicalResults.some(
    (r) => r.startsWith("NIVEL_") || r === "N1" || r === "N2" || r === "N3" || r === "N4" || r === "N5"
  );
  if (hasNumeric) {
    return NUMERIC_LEGEND_ITEMS;
  }

  return SEA_LEGEND_ITEMS;
}