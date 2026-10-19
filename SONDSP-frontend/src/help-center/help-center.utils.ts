/**
 * Identifica o módulo da Central de Ajuda mais adequado com base na rota atual da aplicação.
 * Permite que o botão de Ajuda no cabeçalho direcione o usuário com o filtro correto pré-selecionado.
 */
export function getHelpModuleFromPath(pathname: string): string | null {
  // Rotas da área do professor / pedagógica
  if (pathname.includes('/app-turmas/turma/')) {
    return 'detalhes-turma';
  }
  if (pathname.startsWith('/app-turmas')) {
    return 'turmas-professor';
  }
  if (pathname.startsWith('/app-alunos')) {
    return 'perfil-estudante';
  }
  if (pathname.startsWith('/app-sondagens')) {
    return 'sondagens';
  }
  if (pathname.startsWith('/app-mapa-classe') || pathname.startsWith('/app-trajetorias')) {
    return 'turmas-professor';
  }

  // Rotas da área administrativa
  if (pathname.startsWith('/gerenciamento/alunos')) {
    return 'alunos-admin';
  }
  if (pathname.startsWith('/gerenciamento/usuarios')) {
    return 'gerenciamento-usuarios';
  }
  if (pathname.startsWith('/gerenciamento/turmas')) {
    return 'turmas-admin';
  }
  if (pathname.startsWith('/gerenciamento/modelos-atividades')) {
    return 'modelos-atividades';
  }
  if (pathname.startsWith('/gerenciamento/escolas')) {
    return 'turmas-admin';
  }

  return null;
}
