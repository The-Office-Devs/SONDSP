export function getTitle(complement: string, isEdit: boolean = false, isFilter: boolean = true) {
  if (isFilter) return `Filtro de ${complement}`;
  const title = isEdit ? "Edição de" : "Cadastro de"
  return `${title} ${complement}`;
}