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

export const shiftOptions = [
  { value: "Manhã", label: "Manhã" },
  { value: "Tarde", label: "Tarde" },
  { value: "Integral", label: "Integral" }
];

export const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "false", label: "Aberto" },
  { value: "true", label: "Finalizado" }
];

export const resultOptions = [
  { value: "PS", label: "Pré-Silábico" },
  { value: "SV", label: "Silábico Sem Valor" },
  { value: "CV", label: "Silábico Com Valor" },
  { value: "SA", label: "Semi Alfabético" },
  { value: "ALF", label: "Alfabético" }
];