export function getSubmitLabel(isPending: boolean, isEditMode: boolean) {
  if (isPending) {
    return isEditMode ? "Salvando..." : "Cadastrando...";
  }

  return isEditMode ? "Salvar" : "Cadastrar";
}