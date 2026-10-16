export const ALL_VALUE = "all";
const ALL_OPTION = { value: ALL_VALUE, label: "Todos" };

export const roleOptions = [
  { value: "Administrador", label: "Administrador" },
  { value: "Administrador da Escola", label: "Administrador Escolar" },
  { value: "Coordenador", label: "Coordenador" },
  { value: "Professor", label: "Professor" },
  { value: "POA", label: "Professor Orientador de Área" }
];

export const permissionsOptions = [
  { value: "CREATE_USER", label: "Criar Usuário" },
  { value: "UPDATE_USER", label: "Editar Usuário" },
  { value: "DELETE_USER", label: "Excluir Usuário" }
];

export const subjectOptions = [
  { value: "1", label: "Matemática" },
  { value: "2", label: "Língua Portuguesa" }
];

export const bimesterOptions = ["Inicial", 1, 2, 3, 4].map((n) => {
  const label = n === "Inicial" ? String(n) : `${n}° Bimestre`;
  return { value: label, label };
});

export const gradeLevelOptions = [1, 2, 3].map((n) => {
  const label = `${n}° Ano`;
  return { value: label, label };
});

export const gradeLevelOptionsWithAll = [ALL_OPTION, ...gradeLevelOptions];

export const shiftOptions = [
  { value: "Manhã", label: "Manhã" },
  { value: "Tarde", label: "Tarde" },
  { value: "Integral", label: "Integral" }
];

export const shiftOptionsWithAll = [ALL_OPTION, ...shiftOptions];

export const statusOptions = [
  ALL_OPTION,
  { value: "false", label: "Aberto" },
  { value: "true", label: "Finalizado" }
];

export const resultOptions = [
  { value: "PS", label: "Pré-Silábica (PS)" },
  { value: "SSVC", label: "Silábica Sem Valor Sonoro (SSVC)" },
  { value: "SCVC", label: "Silábica Com Valor Sonoro (SCVC)" },
  { value: "SA", label: "Silábico-Alfabética (SA)" },
  { value: "A", label: "Alfabética (A)" },
  { value: "NIVEL_01", label: "Nível 01" },
  { value: "NIVEL_02", label: "Nível 02" },
  { value: "NIVEL_03", label: "Nível 03" },
  { value: "NIVEL_04", label: "Nível 04" },
  { value: "NIVEL_05", label: "Nível 05" },
  { value: "ADEQUADA", label: "Compreensão Adequada" },
  { value: "INADEQUADA", label: "Compreensão Inadequada" },
  { value: "NAO_RESPONDEU", label: "Não Respondeu" },
  { value: "ACERTOU", label: "Acertou" },
  { value: "ACERTOU_PARCIALMENTE", label: "Acertou Parcialmente" },
  { value: "ERROU", label: "Errou" }
];

export const seaResultOptions = [
  { value: "PS", label: "Pré-Silábica (PS)" },
  { value: "SSVC", label: "Silábica Sem Valor Sonoro (SSVC)" },
  { value: "SCVC", label: "Silábica Com Valor Sonoro (SCVC)" },
  { value: "SA", label: "Silábico-Alfabética (SA)" },
  { value: "A", label: "Alfabética (A)" }
];

export const textProductionResultOptions = [
  { value: "NIVEL_01", label: "Nível 01 — Não produziu / Fuga ao gênero" },
  { value: "NIVEL_02", label: "Nível 02 — Fuga ao tema / Reescrita sem autoria" },
  { value: "NIVEL_03", label: "Nível 03 — Ausência de elementos / Coerência parcial" },
  { value: "NIVEL_04", label: "Nível 04 — Produção adequada / Autoria criativa" },
  { value: "PS", label: "Pré-Silábica (PS - Diagnóstico SEA)" },
  { value: "SSVC", label: "Silábica Sem Valor (SSVC - Diagnóstico SEA)" },
  { value: "SCVC", label: "Silábica Com Valor (SCVC - Diagnóstico SEA)" },
  { value: "SA", label: "Silábico-Alfabética (SA - Diagnóstico SEA)" }
];

export const mathNumberWritingResultOptions = [
  { value: "NIVEL_01", label: "Nível 01 — Não utiliza algarismos (letras, garatujas)" },
  { value: "NIVEL_02", label: "Nível 02 — Reconhece algarismos sem correspondência plena" },
  { value: "NIVEL_03", label: "Nível 03 — Apoio na oralidade e justaposição aditiva (704 p/ 74)" },
  { value: "NIVEL_04", label: "Nível 04 — Domínio parcial do valor posicional (nós/zeros intercalados)" },
  { value: "NIVEL_05", label: "Nível 05 — Domínio consolidado do SND" }
];

export const readingResultOptions = [
  { value: "ADEQUADA", label: "Compreensão Adequada" },
  { value: "INADEQUADA", label: "Compreensão Inadequada" },
  { value: "NAO_RESPONDEU", label: "Não Respondeu" }
];

export const mathProblemResultOptions = [
  { value: "ACERTOU", label: "Acertou" },
  { value: "ACERTOU_PARCIALMENTE", label: "Acertou Parcialmente" },
  { value: "ERROU", label: "Errou" }
];

export function getPedagogicalResultOptions(
  strandName?: string,
  gradeLevel?: string,
  activityName?: string
) {
  const strand = (strandName ?? "").toLowerCase();
  const grade = (gradeLevel ?? "").toLowerCase();
  const activity = (activityName ?? "").toLowerCase();

  if (strand.includes("leitura") || activity.includes("leitura")) {
    return readingResultOptions;
  }

  if (strand.includes("matem") || activity.includes("matem")) {
    if (activity.includes("problema") || activity.includes("campo") || activity.includes("situac")) {
      return mathProblemResultOptions;
    }
    return mathNumberWritingResultOptions;
  }

  if (
    grade.includes("2") ||
    grade.includes("3") ||
    activity.includes("convite") ||
    activity.includes("conto") ||
    activity.includes("producao")
  ) {
    return textProductionResultOptions;
  }

  return seaResultOptions;
}