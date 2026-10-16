/**
 * Tipagens Oficiais do Portfólio Individual do Aluno (SONDSP).
 * Alinhado às Diretrizes Pedagógicas Oficiais da SME-SP e aos DTOs do Back-end Spring Boot.
 * Clean Architecture — Nenhuma compatibilidade com dados legados necessária.
 */

// ============================================================================
// 1. Enums de Domínio Pedagógico (SME-SP)
// ============================================================================

/** 5 momentos obrigatórios de aplicação ao longo do ano letivo (Diretriz 4.1 SME-SP). */
export type ApplicationPeriod =
  | "INICIAL"
  | "PRIMEIRO_BIMESTRE"
  | "SEGUNDO_BIMESTRE"
  | "TERCEIRO_BIMESTRE"
  | "QUARTO_BIMESTRE";

/** Tipo de instrumento estrutural de avaliação. Vinculado à Atividade Pedagógica (em Português conforme SME-SP). */
export type EvaluationType =
  | "ESCRITA_SEA"         // Aquisição do SEA (1º Ano e casos excepcionais de 2º/3º: PS, SSVC, SCVC, SA, A)
  | "PRODUCAO_TEXTO"      // Produção de Texto (2º Convite / 3º Final de Conto: NIVEL_01 a NIVEL_04 - Saeb 743)
  | "LEITURA"             // Práticas de Leitura (Localização, Inferência, Apreciação)
  | "ESCRITA_NUMEROS"     // Escrita de Números SND (Nível 01 a 05)
  | "SITUACOES_PROBLEMA"; // Eixos Estruturantes da Matemática (Situações-Problema)

/** Hipóteses de Aquisição do SEA - 1º Ano (Diretriz 2.1.A SME-SP). */
export type SeaHypothesis =
  | "PS"    // Pré-Silábica
  | "SSVC"  // Silábica Sem Valor Sonoro Convencional
  | "SCVC"  // Silábica Com Valor Sonoro Convencional
  | "SA"    // Silábico-Alfabética
  | "A";    // Alfabética

/** Níveis Oficiais de Produção Textual - 2º e 3º Anos (Corte 743 Saeb / Alfabetiza Brasil). */
export type TextProductionLevel = "NIVEL_01" | "NIVEL_02" | "NIVEL_03" | "NIVEL_04";

/** Níveis Oficiais de Escrita de Números - Ditado SND (Diretriz 3.1 SME-SP). */
export type NumberWritingLevel =
  | "NIVEL_01"  // Não utiliza algarismos (letras, rabiscos, garatujas)
  | "NIVEL_02"  // Reconhece necessidade de algarismos sem correspondência plena
  | "NIVEL_03"  // Apoio na oralidade e justaposição aditiva (ex: 704 para 74)
  | "NIVEL_04"  // Domínio parcial do valor posicional (nós e zeros intercalados)
  | "NIVEL_05"; // Domínio consolidado do Sistema de Numeração Decimal

/** Capacidades de Compreensão Leitora por questão (Diretriz 2.2 SME-SP). */
export type ReadingCapacity = "LOCALIZACAO" | "INFERENCIA" | "APRECIACAO_REPLICA";

/** Status da Resposta de Leitura. */
export type ReadingItemStatus = "NAO_RESPONDEU" | "INADEQUADA" | "ADEQUADA";

/** Eixos Estruturantes da Matriz Curricular de Matemática (Diretriz 3.2 SME-SP). */
export type MathAxis =
  | "ALGEBRA"
  | "GEOMETRIA"
  | "GRANDEZAS_MEDIDAS"
  | "PROBABILIDADE_ESTATISTICA"
  | "NUMEROS";

/** Status de Resolução de Situações-Problema de Matemática. */
export type MathProblemStatus = "ERROU" | "ACERTOU_PARCIALMENTE" | "ACERTOU";

/** Tags Oficiais do Módulo de Anotações do Estudante. */
export type AnnotationTag = "CONSELHO" | "PEDAGOGICA" | "RESPONSAVEIS";

/** Status da Matrícula Escolar do Aluno. */
export type EnrollmentStatus = "CURSANDO" | "CONCLUIDO" | "TRANSFERIDO" | "REMANEJADO";

/** Comparação Neutra de Trajetória (Sem Rotulagem Punitiva). */
export type EvolutionComparison = "PRIMEIRO_REGISTRO" | "MANTIDO" | "ALTERADO";

/** Papéis de Usuários Autorizados no SONDSP. */
export type UserRole = "ADMINISTRATOR" | "SCHOOL_ADMINISTRATOR" | "COORDINATOR" | "TEACHER" | "POA";

// ============================================================================
// 2. Contratos de Dados e DTOs (API Back-end Spring Boot)
// ============================================================================

export interface SchoolRef {
  id: number;
  name: string;
}

export interface SchoolClassRef {
  id: number;
  name: string;
  gradeLevel: string;
  schoolYear: string;
  shift?: string | null;
  school?: SchoolRef;
}

export interface EnrollmentHistoryItem {
  id?: number;
  year: string;
  schoolClass: string;
  schoolClassDetails?: {
    id: number;
    name: string;
    gradeLevel: string;
    schoolName: string;
  } | null;
  externalDescription?: string | null;
  status: EnrollmentStatus;
  statusLabel?: string;
  statusVariant?: "success" | "secondary" | "warning";
  startDate?: string | null;
  endDate?: string | null;
}

export interface AnnotationAuthor {
  id: number;
  name: string;
  role: UserRole;
  roleLabel?: string;
  prefix?: string;
}

export interface StudentAnnotation {
  id: number;
  studentId?: number;
  authorId?: number;
  author?: AnnotationAuthor;
  authorName: string;
  authorRole: string;
  authorPrefix?: string;
  date: string; // Exibição formatada: DD/MM/YYYY
  createdAt?: string; // Formato ISO-8601 da API: YYYY-MM-DDTHH:mm:ss
  updatedAt?: string | null;
  text: string;
  tags: AnnotationTag[];
  canEdit: boolean;
}

export interface ReadingCapacityItem {
  itemNumber?: number;
  capacity: ReadingCapacity | string;
  description?: string;
  status: ReadingItemStatus;
  statusLabel: string;
}

export interface MathProblemItem {
  problemNumber: number;
  axis?: MathAxis;
  description: string;
  status: MathProblemStatus;
  statusLabel: string;
}

export interface TimelineEvolution {
  hasEvolution: boolean;
  comparison?: EvolutionComparison;
  strandId?: number;
  evaluationType?: EvaluationType;
  previousSurveyId?: number | null;
  previousPeriod?: ApplicationPeriod | string;
  previousSchoolYear?: string;
  previousCode?: string;
  previousColor?: string;
  currentCode?: string;
  currentColor?: string;
  text?: string;
}

export interface TimelineSurveyItem {
  id: number;
  surveyId?: number;
  strand: string;
  strandKey: "escrita" | "leitura" | "matematica" | string;
  evaluationType: EvaluationType;
  bimester: string;
  period?: ApplicationPeriod;
  schoolYear?: string;
  schoolClassName?: string;
  date: string;
  appliedAt?: string; // ISO-8601
  activityTitle: string;
  levelCode: string; // Códigos oficiais: PS, SSVC, SCVC, SA, A, NIVEL_01..NIVEL_05, AD, 3/4
  levelLabel: string;
  levelColor?: string;
  levelTextColor?: string;
  evolution: TimelineEvolution;
  notes: string;
  hasEvidence: boolean;
  evidenceUrl?: string | null;
  evidenceTitle?: string;
  readingCapacities?: ReadingCapacityItem[];
  mathProblems?: MathProblemItem[];
}

export interface StudentPortfolioDTO {
  id: number;
  name: string;
  initials: string;
  currentClass: string;
  currentSchoolClass?: SchoolClassRef | null;
  school: string;
  schoolYear: string;
  registration: string;
  rowNumber?: number;
  status: "ATIVO" | "INATIVO" | string;
  enrollmentHistory: EnrollmentHistoryItem[];
}

export {
  getSurveyLevelStyle,
  getBadgeLevelCode,
  getEnrollmentStatusBadge,
  type SurveyLevelStyle,
  type EnrollmentBadgeStyle
} from "@/lib/survey-utils";

// ============================================================================
// 3. Metadados Visuais e Mapeamentos de Estilo (Tailwind CSS)
// ============================================================================

export const TAG_METADATA: Record<
  AnnotationTag,
  {
    label: string;
    filterClass: string;
    chipClass: string;
    toggleActiveClass: string;
    toggleInactiveClass: string;
  }
> = {
  CONSELHO: {
    label: "Conselho",
    filterClass: "bg-[#f5e8fc] text-[#9333ea] border-[#e9d5ff] hover:bg-[#ebd3f8]",
    chipClass: "bg-[#f5e8fc] text-[#9333ea] border border-[#e9d5ff]",
    toggleActiveClass: "bg-[#9333ea] text-white hover:bg-[#7e22ce]",
    toggleInactiveClass: "border border-[#9333ea] text-[#9333ea] hover:bg-[#faf5ff]"
  },
  PEDAGOGICA: {
    label: "Pedagógica",
    filterClass: "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd] hover:bg-[#bae6fd]",
    chipClass: "bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd]",
    toggleActiveClass: "bg-[#0284c7] text-white hover:bg-[#0369a1]",
    toggleInactiveClass: "border border-[#0284c7] text-[#0284c7] hover:bg-[#f0f9ff]"
  },
  RESPONSAVEIS: {
    label: "Responsáveis",
    filterClass: "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0] hover:bg-[#bbf7d0]",
    chipClass: "bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]",
    toggleActiveClass: "bg-[#16a34a] text-white hover:bg-[#15803d]",
    toggleInactiveClass: "border border-[#16a34a] text-[#16a34a] hover:bg-[#f0fdf4]"
  }
};

export const APPLICATION_PERIOD_LABELS: Record<ApplicationPeriod, string> = {
  INICIAL: "Sondagem Inicial",
  PRIMEIRO_BIMESTRE: "1º Bimestre",
  SEGUNDO_BIMESTRE: "2º Bimestre",
  TERCEIRO_BIMESTRE: "3º Bimestre",
  QUARTO_BIMESTRE: "4º Bimestre"
};

export const SEA_HYPOTHESIS_LABELS: Record<SeaHypothesis, string> = {
  PS: "Pré-Silábica",
  SSVC: "Silábica Sem Valor Sonoro Convencional",
  SCVC: "Silábica Com Valor Sonoro Convencional",
  SA: "Silábico-Alfabética",
  A: "Alfabética"
};
