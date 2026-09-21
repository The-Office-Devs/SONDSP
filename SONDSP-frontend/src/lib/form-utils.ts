export function getSubmitLabel(
  isPending: boolean, 
  type: 'insert' | 'edit' | 'filter'
) {
  if (isPending) {
    switch (type) {
      case 'insert':
        return "Cadastrando...";
      case 'edit': 
        return "Salvando...";
      case 'filter':
        return "Buscando...";
    }
  }

  switch (type) {
    case 'insert':
      return "Cadastrar";
    case 'edit': 
      return "Salvar";
    case 'filter':
      return "Buscar";
  }
}