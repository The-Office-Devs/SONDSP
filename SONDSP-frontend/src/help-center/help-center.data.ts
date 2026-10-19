import type { HelpModule } from './help-center.types';

export const HELP_SUPPORT_CONTACT = {
  label: 'Precisa de mais ajuda? Entre em contato com o suporte técnico',
  email: 'suporte@sistemaeducacional.sp.gov.br',
};

export const HELP_MODULES: HelpModule[] = [
  // ==========================================
  // MÓDULOS DE ADMINISTRADOR
  // ==========================================
  {
    id: 'gerenciamento-usuarios',
    title: 'Gerenciamento de Usuários',
    audience: ['admin'],
    description: 'Cadastro, edição e controle de acesso de usuários no sistema.',
    topics: [
      {
        id: 'cadastrar-usuario',
        title: 'Como cadastrar um usuário',
        steps: [
          'Acesse "Área do Administrador" > "Usuários".',
          'Preencha "E-mail Institucional", "Registro Funcional (RF)" e "Nome Completo".',
          'Selecione a "Função" e as "Permissões".',
          'Clique em "Cadastrar".',
        ],
      },
      {
        id: 'editar-usuario',
        title: 'Como editar um usuário',
        steps: [
          'Na lista de usuários, clique no botão azul com ícone de lápis.',
          'Altere as informações desejadas e clique em "Salvar" (ou "Cancelar" para interromper).',
        ],
      },
      {
        id: 'inativar-ativar-usuario',
        title: 'Como inativar ou ativar um usuário',
        steps: [
          'Na lista de usuários, vá até a coluna "Ações".',
          'Clique no botão vermelho com um "X" para inativar, ou no botão verde para ativar.',
        ],
      },
    ],
  },
  {
    id: 'turmas-admin',
    title: 'Turmas (Administração)',
    audience: ['admin'],
    description: 'Gestão de turmas escolares e vinculação de docentes.',
    topics: [
      {
        id: 'cadastrar-turma',
        title: 'Como cadastrar uma turma',
        steps: [
          'Acesse "Área do Administrador" > "Turmas".',
          'Selecione "Escola", "Ano Escolar" e "Turno".',
          'Preencha "Nome" e "Ano Letivo".',
          'Clique em "Cadastrar".',
        ],
      },
      {
        id: 'editar-turma',
        title: 'Como editar uma turma',
        steps: [
          'Na lista de turmas, clique no botão azul com ícone de lápis.',
          'Altere as informações desejadas e clique em "Salvar" (ou "Cancelar" para interromper).',
        ],
      },
      {
        id: 'inativar-ativar-turma',
        title: 'Como inativar ou ativar uma turma',
        steps: [
          'Na lista de turmas, vá até a coluna "Ações".',
          'Clique no botão vermelho com um "X" para inativar, ou no botão verde para ativar.',
        ],
        alert: {
          type: 'warning',
          message: 'O sistema não permite desativar turmas que possuam alunos ativos vinculados.',
        },
      },
      {
        id: 'vincular-desvincular-professores',
        title: 'Como vincular ou desvincular professores',
        steps: [
          'Na lista de turmas, clique no botão branco com ícone de elo (corrente).',
          'Na janela que se abrir, busque pelo nome do professor.',
          'Clique no botão branco (elo) para vincular, ou no botão vermelho (elo cortado) para remover um vínculo existente.',
        ],
      },
    ],
  },
  {
    id: 'modelos-atividades',
    title: 'Modelos de Atividades',
    audience: ['admin'],
    description: 'Cadastro e disponibilização de matrizes e atividades avaliativas.',
    topics: [
      {
        id: 'cadastrar-modelo-atividade',
        title: 'Como cadastrar um modelo de atividade',
        steps: [
          'Acesse "Área do Administrador" > "Modelos de Atividades".',
          'Preencha o campo "Nome" e digite o "Eixo".',
          'Selecione "Matéria", "Ano Escolar" e "Bimestre".',
          'Anexe o arquivo na área indicada. (Atenção: Permitido apenas formato PDF ou Imagem).',
          'Clique em "Cadastrar".',
        ],
        alert: {
          type: 'info',
          message: 'Atividades não podem ser editadas. Em caso de erro, inative o modelo atual e cadastre um novo.',
        },
      },
      {
        id: 'visualizar-baixar-atividade',
        title: 'Como visualizar ou baixar uma atividade',
        steps: [
          'Na lista de atividades, clique no botão com o ícone de olho.',
          'Para salvar no seu computador, clique em "Baixar" na janela que será aberta.',
        ],
      },
      {
        id: 'inativar-ativar-atividade',
        title: 'Como inativar ou ativar uma atividade',
        steps: [
          'Na lista de atividades, localize a coluna "Ações".',
          'Clique no botão vermelho com um "X" para inativar, ou no botão verde para ativar.',
        ],
      },
    ],
  },
  {
    id: 'alunos-admin',
    title: 'Alunos (Administração)',
    audience: ['admin'],
    description: 'Matrícula e importação em lote de estudantes.',
    topics: [
      {
        id: 'cadastrar-aluno-individual',
        title: 'Como cadastrar um aluno individualmente',
        steps: [
          'Acesse "Área do Administrador" > "Alunos".',
          'No campo "Modo do Cadastro", selecione "Individual".',
          'Preencha "N° Chamada", "Matrícula", "Código do Aluno", "Nome Completo" e "Data de Nascimento".',
          'Selecione a "Escola" e "Turma" correspondentes.',
          'Clique em "Cadastrar".',
        ],
      },
      {
        id: 'cadastrar-alunos-lote',
        title: 'Como cadastrar alunos em lote',
        steps: [
          'No campo "Modo do Cadastro", selecione "Em Lote".',
          'Arraste ou selecione o arquivo com a listagem. (Atenção: O arquivo deve ser obrigatoriamente no formato XML).',
          'Clique em "Importar".',
        ],
      },
      {
        id: 'editar-aluno',
        title: 'Como editar um aluno',
        steps: [
          'Na lista de alunos, clique no botão azul com ícone de lápis.',
          'Altere os dados desejados e clique em "Salvar" ou em "Cancelar" para reverter as alterações.',
        ],
      },
      {
        id: 'inativar-ativar-aluno',
        title: 'Como inativar ou ativar um aluno',
        steps: [
          'Na lista de alunos, localize a coluna "Ações".',
          'Clique no botão vermelho com um "X" para inativar, ou no botão verde para ativar.',
        ],
      },
    ],
  },

  // ==========================================
  // MÓDULOS DE PROFESSOR
  // ==========================================
  {
    id: 'turmas-professor',
    title: 'Turmas (Área do Professor)',
    audience: ['professor'],
    description: 'Filtros, visualização de turmas e emissão de relatórios.',
    topics: [
      {
        id: 'buscar-turmas',
        title: 'Como buscar suas turmas',
        steps: [
          'No menu lateral, acesse "Área do Professor" > "Turmas".',
          'Selecione "Escola", "Turno", "Ano Escolar" e "Ano Letivo" nos filtros. (A escola só aparece se você possuir vínculo nela).',
          'Clique em "Buscar".',
        ],
      },
      {
        id: 'limpar-filtros-turmas',
        title: 'Como limpar os filtros',
        steps: [
          'Clique no botão branco "Limpar Campos" no topo da tela.',
        ],
      },
      {
        id: 'acessar-detalhes-turma',
        title: 'Como acessar os detalhes da turma',
        steps: [
          'Na lista de resultados, localize a turma e clique em "Abrir Turma".',
        ],
      },
      {
        id: 'gerar-relatorios',
        title: 'Como gerar relatórios',
        steps: [
          'Na lista de resultados, localize a turma e clique em "Gerar Relatório".',
        ],
        alert: {
          type: 'warning',
          message: 'O arquivo será gerado em segundo plano. Você pode navegar normalmente por outras telas, mas não recarregue a página.',
        },
      },
    ],
  },
  {
    id: 'detalhes-turma',
    title: 'Detalhes da Turma',
    audience: ['professor'],
    description: 'Visualização da listagem de estudantes e anotações da turma.',
    topics: [
      {
        id: 'visualizar-turma',
        title: 'Como visualizar sua turma',
        steps: [
          'Selecione "Matéria", "Eixo" e "Bimestre" nos filtros superiores.',
          'Clique em "Buscar".',
        ],
      },
      {
        id: 'acessar-perfil-aluno',
        title: 'Como acessar o perfil de um aluno',
        steps: [
          'Na lista de alunos, clique sobre o nome do aluno desejado.',
        ],
      },
      {
        id: 'criar-anotacao-turma',
        title: 'Como criar uma anotação',
        steps: [
          'No painel "Anotações", clique em "+ Nova Anotação".',
          'Digite sua mensagem e clique em "Salvar".',
        ],
      },
      {
        id: 'editar-excluir-anotacao-turma',
        title: 'Como editar ou excluir uma anotação',
        steps: [
          'Localize a anotação e clique no ícone de três pontos.',
          'Selecione a opção "Editar" ou "Excluir".',
        ],
      },
    ],
  },
  {
    id: 'perfil-estudante',
    title: 'Perfil do Estudante',
    audience: ['professor'],
    description: 'Linha do tempo de sondagens, evidências e acompanhamento individual.',
    topics: [
      {
        id: 'visualizar-evidencia-sondagem',
        title: 'Como visualizar a evidência de uma sondagem',
        steps: [
          'No quadro "Linha do Tempo de Sondagens", localize a avaliação desejada na lista.',
          'Clique na opção "Ver evidência" para abrir a janela contendo a atividade feita pelo aluno.',
        ],
      },
      {
        id: 'acessar-historico-completo-sondagens',
        title: 'Como acessar o histórico completo de sondagens',
        steps: [
          'No canto superior direito do quadro de sondagens, clique no link "Ver Histórico Completo". Você será direcionado para a tela de listagem de sondagens.',
        ],
      },
      {
        id: 'criar-anotacao-aluno',
        title: 'Como criar uma anotação',
        steps: [
          'No quadro "Anotações", clique no botão "+ Nova Anotação".',
          'Digite sua mensagem e salve para registrar a observação no perfil do aluno.',
        ],
      },
      {
        id: 'editar-excluir-anotacao-aluno',
        title: 'Como editar ou excluir uma anotação',
        steps: [
          'Localize a anotação desejada e clique no ícone de três pontos verticais.',
          'Selecione a opção "Editar" ou "Excluir".',
        ],
      },
    ],
  },
  {
    id: 'sondagens',
    title: 'Sondagens',
    audience: ['professor'],
    description: 'Lançamento de hipóteses de escrita, leitura e materiais de apoio.',
    topics: [
      {
        id: 'criar-sondagem',
        title: 'Como criar uma sondagem',
        steps: [
          'Busque a turma e localize o aluno na lista.',
          'Clique no botão "Criar" correspondente ao aluno.',
          'Na janela que se abrir, selecione a atividade desejada (é possível baixar o arquivo da atividade nesta mesma tela).',
        ],
      },
      {
        id: 'acessar-historico-sondagens',
        title: 'Como acessar o histórico de sondagens',
        steps: [
          'Na lista de alunos, clique no botão "Listar".',
          'O sistema abrirá a tela com todo o histórico de avaliações daquele estudante.',
        ],
      },
      {
        id: 'finalizar-inserir-resultados',
        title: 'Como finalizar e inserir resultados',
        steps: [
          'Dentro do histórico do aluno, localize a sondagem e clique em "Finalizar".',
          'Insira o resultado, digite suas observações e anexe a evidência (foto ou arquivo da atividade realizada).',
        ],
      },
      {
        id: 'visualizar-sondagem-finalizada',
        title: 'Como visualizar uma sondagem finalizada',
        steps: [
          'No histórico, clique no ícone de olho ao lado da sondagem concluída.',
          'Verifique o status da avaliação ou faça o download da atividade anexada.',
        ],
      },
    ],
  },
];
