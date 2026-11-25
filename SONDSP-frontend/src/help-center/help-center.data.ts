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
    id: 'alunos-admin',
    title: 'Alunos (Administração)',
    audience: ['admin'],
    description: 'Matrícula e importação em lote de estudantes.',
    topics: [
      {
        id: 'cadastrar-aluno-individual',
        title: 'Como Cadastrar um Aluno Individualmente',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Administrador" e, em seguida, selecione "Alunos". Mantenha o "Modo do Cadastro" definido como "Individual".',
        steps: [
          '**Preencha os Dados do Aluno:** Insira todas as informações obrigatórias nos campos solicitados: "Nº Chamada", "Matrícula", "Nome Completo" e "Data de Nascimento".',
          '**Selecione a Turma:** Clique no campo "Turma" (Selecione a turma) e escolha uma turma que já esteja cadastrada no sistema para o ano letivo vigente.',
          '**Finalize o Cadastro:** Com todos os campos preenchidos, clique no botão "✓ Cadastrar" no canto inferior direito do formulário. O aluno aparecerá automaticamente na tabela logo abaixo.',
        ],
        image: {
          src: '/src/assets/help/cadastro_aluno.jpg',
          alt: 'Cadastro de Aluno',
        },
      },
      {
        id: 'cadastrar-alunos-lote',
        title: 'Como Cadastrar Alunos em Lote',
        steps: [
          'No campo "Modo do Cadastro", selecione "Em Lote".',
          'Arraste ou selecione o arquivo com a listagem. (Atenção: O arquivo deve ser obrigatoriamente no formato XML).',
          'Clique em "Importar".',
        ],
      },
      {
        id: 'editar-aluno',
        title: 'Como Editar um Aluno',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Administrador" e, em seguida, selecione "Alunos".',
        steps: [
          '**Inicie a Edição:** Na tabela de alunos, localize o registro desejado e clique no ícone de lápis na coluna "Ações".',
          '**Altere os Dados:** O painel superior mudará para "Edição de Aluno", carregando automaticamente as informações atuais do estudante. Modifique os campos necessários: "Nº Chamada", "Matrícula", "Nome Completo", "Data de Nascimento" ou "Turma".',
          '**Confirme as Alterações:** Clique no botão azul "✓ Salvar" para aplicar e registrar as mudanças.',
          '**Descarte se Necessário:** Caso desista da edição e queira manter os dados originais sem alterar nada, clique no botão "✕ Cancelar".',
        ],
        alert: {
          type: 'info',
          message: 'O ícone de lápis fica desabilitado para alunos inativos. Para editar um aluno inativo, ative-o primeiro.',
        },
        image: {
          src: '/src/assets/help/edicao_alunos.jpg',
          alt: 'Edição de Aluno',
        },
      },
      {
        id: 'inativar-aluno',
        title: 'Como Inativar um Aluno',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Administrador" e, em seguida, selecione "Alunos".',
        steps: [
          '**Inicie a Inativação:** Na tabela de alunos, localize o registro desejado e clique no botão vermelho com o "✕" na coluna "Ações".',
          '**Confira a Janela:** Uma janela de confirmação intitulada "Inativar Aluno" será exibida na tela para garantir a segurança da ação.',
          '**Confirme ou Cancele:** Clique no botão vermelho "Sim" para confirmar a inativação do aluno. Caso queira desistir e cancelar a ação, clique em "Não" ou no "✕" no canto superior direito da janela.',
        ],
        alert: {
          type: 'info',
          message: 'Para reativar um aluno inativo, clique no botão verde com o ✓ na mesma coluna "Ações" e confirme em "Sim".',
        },
        image: {
          src: '/src/assets/help/desativar_aluno.jpg',
          alt: 'Tela de alunos com o botão vermelho de inativar na coluna Ações, a janela Inativar Aluno e o botão Sim, numerados de 1 a 3.',
        },
      },
    ],
  },
  {
    id: 'funcoes-permissoes',
    title: 'Funções e Permissões',
    audience: ['admin'],
    description: 'Criação de funções e definição do que os usuários vinculados a cada uma podem acessar.',
    topics: [
      {
        id: 'cadastrar-funcao',
        title: 'Como Cadastrar Funções e Permissões',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Administrador" e, em seguida, selecione "Funções e Permissões" para abrir a tela de gerenciamento.',
        steps: [
          '**Defina o Nome da Função:** No campo "Nome da Função", digite o título do perfil que deseja criar (ex.: Coordenador Pedagógico ou Professor Auxiliar).',
          '**Selecione as Permissões:** Nos blocos abaixo, marque as caixas correspondentes às ações liberadas para essa função em cada módulo — "Atividades", "Usuários", "Funções e Permissões", "Alunos", "Turmas", "Sondagens" e "Anotações / Portfólio" — ou clique em "Selecionar todos" no topo de qualquer categoria para marcar o bloco de uma vez.',
          '**Salvar:** Ao finalizar, clique no botão azul "✓ Salvar" no canto inferior direito para concluir o cadastro. Caso queira descartar o preenchimento, clique em "✕ Cancelar".',
        ],
        image: {
          src: '/src/assets/help/cadastro_funcoes.jpg',
          alt: 'Cadastro de Funções e Permissões',
        },
      },
      {
        id: 'editar-funcao',
        title: 'Como Editar Funções e Permissões',
        intro: 'Para atualizar ou alterar as permissões de uma função cadastrada, siga estes passos:',
        steps: [
          '**Inicie a Edição:** Na tabela de funções ativas, localize a que deseja modificar e clique no ícone de lápis na coluna "Ações", ao lado do nome dela.',
          '**Modifique as Permissões:** O painel superior se transformará em "Edição de Função", carregando automaticamente os dados e as permissões atuais daquele perfil. Para adicionar novas regras de acesso ou remover existentes, basta clicar nas caixas de seleção correspondentes.',
          '**Salve as Alterações:** Se estiver tudo correto, clique no botão azul "✓ Salvar" para confirmar e concluir as alterações no perfil.',
          '**Cancele se necessário:** Caso desista de fazer mudanças, clique em "✕ Cancelar" para sair do modo de edição sem alterar o perfil.',
        ],
        image: {
          src: '/src/assets/help/edicao_funcoes.jpg',
          alt: 'Edição de Funções e Permissões',
        },
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
        title: 'Como Cadastrar um Modelo de Atividade',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Administrador" e, em seguida, selecione "Atividades".',
        steps: [
          '**Informe o Nome:** No campo "Nome", digite o título do modelo de atividade (ex.: Ditado de Palavras e Frase - Sondagem Inicial).',
          '**Selecione os Critérios Pedagógicos:** Nos menus suspensos, escolha a "Matéria", o "Eixo", o "Ano Escolar" e o "Bimestre" correspondentes à atividade (o Eixo só é liberado depois de escolher a Matéria).',
          '**Anexe o Arquivo da Atividade:** No campo "Modelo de Atividade", arraste o arquivo para a área tracejada ou clique nela para selecioná-lo no computador (imagem ou PDF).',
          '**Finalize o Cadastro:** Com todos os campos preenchidos e o arquivo anexado, clique no botão "✓ Cadastrar" no canto inferior direito do formulário. A nova atividade aparecerá automaticamente na tabela logo abaixo.',
        ],
        alert: {
          type: 'info',
          message: 'Atividades não podem ser editadas. Em caso de erro, inative o modelo atual e cadastre um novo.',
        },
        image: {
          src: '/src/assets/help/cadastro_atividades.jpg',
          alt: 'Cadastro de Atividades',
        },
      },
      {
        id: 'visualizar-baixar-atividade',
        title: 'Como Visualizar ou Baixar uma Atividade',
        steps: [
          'Na lista de atividades, clique no botão com o ícone de olho.',
          'Para salvar no seu computador, clique em "Baixar" na janela que será aberta.',
        ],
      },
      {
        id: 'inativar-ativar-atividade',
        title: 'Como Inativar uma Atividade',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Administrador" e, em seguida, selecione "Atividades".',
        steps: [
          '**Inicie a Inativação:** Na tabela de atividades cadastradas, localize o modelo desejado e clique no botão vermelho com o "✕" na coluna "Ações".',
          '**Confira a Janela:** Uma janela de confirmação intitulada "Inativar Modelo de Atividade" será exibida na tela para garantir a segurança da ação.',
          '**Confirme ou Cancele:** Clique no botão vermelho "Sim" para confirmar a inativação do modelo de atividade. Caso queira desistir e cancelar a ação, clique em "Não" ou no "✕" no canto superior direito da janela.',
        ],
        alert: {
          type: 'info',
          message: 'Modelos inativos deixam de aparecer para os professores na hora de criar uma sondagem. Para reativar, clique no botão verde com o ✓ na mesma coluna "Ações" e confirme em "Sim".',
        },
        image: {
          src: '/src/assets/help/desativar_atividade.jpg',
          alt: 'Inativar Atividade',
        },
      },
    ],
  },
  {
    id: 'turmas-admin',
    title: 'Turmas',
    audience: ['admin'],
    description: 'Gestão de turmas escolares e vinculação de docentes.',
    topics: [
      {
        id: 'cadastrar-turma',
        title: 'Como Cadastrar uma Turma',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Administrador" e, em seguida, selecione "Turmas".',
        steps: [
          '**Informe o Nome da Turma:** No campo "Nome", digite a identificação da turma (ex.: 3º Ano A ou 1º Ano B).',
          '**Selecione o Ano Escolar:** No menu suspenso "Ano Escolar", escolha o ano correspondente à turma.',
          '**Informe o Ano Letivo:** No campo "Ano Letivo", digite o ano vigente da turma (ex.: 2026).',
          '**Selecione o Turno:** No menu "Turno", escolha o período das aulas (como Manhã, Tarde ou Integral).',
          '**Finalize o Cadastro:** Com todos os campos preenchidos, clique no botão "✓ Cadastrar" no canto inferior direito do formulário. A nova turma aparecerá automaticamente na tabela logo abaixo.',
        ],
        image: {
          src: '/src/assets/help/cadastro_turmas.jpg',
          alt: 'Cadastro de Turmas',
        },
      },
      {
        id: 'editar-turma',
        title: 'Como Editar uma Turma',
        steps: [
          'Na lista de turmas, clique no botão azul com ícone de lápis.',
          'Altere as informações desejadas e clique em "Salvar" (ou "Cancelar" para interromper).',
        ],
      },
      {
        id: 'inativar-turma',
        title: 'Como Inativar uma Turma',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Administrador" e selecione "Turmas".',
        steps: [
          '**Inicie a Inativação:** Na tabela de turmas, localize a turma desejada e clique no botão vermelho com o "✕", o último à direita na coluna "Ações".',
          '**Confira a Janela:** Uma janela de confirmação intitulada "Inativar Turma" será exibida na tela para garantir a segurança da ação.',
          '**Confirme ou Desista:** Clique no botão vermelho "Sim" para confirmar a inativação da turma. Caso queira desistir, clique em "Não" ou no "✕" no canto superior direito da janela.',
        ],
        alert: {
          type: 'warning',
          message: 'O sistema não permite inativar turmas que possuam alunos ativos vinculados.',
        },
        image: {
          src: '/src/assets/help/desativar_turma.jpg',
          alt: 'Inativar Turma',
        },
      },
      {
        id: 'vincular-desvincular-professores',
        title: 'Como Vincular e Desvincular Usuários à Turma',
        intro: 'Para gerenciar quais professores ou usuários têm acesso a uma turma específica, siga o passo a passo:',
        steps: [
          '**Abra a Janela de Vínculo:** Na tabela de turmas, localize a turma desejada e clique no ícone de elo, o botão do meio na coluna "Ações".',
          '**Localize o Usuário:** Na janela "Vincular Professores", use a lista ou o campo de busca para encontrar o usuário que deseja gerenciar.',
          '**Vincular Usuário:** Se o botão de elo ao lado do usuário estiver **branco**, clique nele para vincular o usuário à turma.',
          '**Desvincular Usuário:** Se o botão de elo estiver **vermelho** (com o elo cortado), clique nele para remover o vínculo do usuário com a turma.',
          '**Finalize:** Após concluir os ajustes, clique em "Fechar" na parte inferior ou no "✕" no canto superior direito da janela.',
        ],
        image: {
          src: '/src/assets/help/vincular_desvincular_turma.jpg',
          alt: 'Vincular e Desvincular Usuários à Turma',
        },
      },
    ],
  },
  {
    id: 'gerenciamento-usuarios',
    title: 'Gerenciamento de Usuários',
    audience: ['admin'],
    description: 'Cadastro, edição e controle de acesso de usuários no sistema.',
    topics: [
      {
        id: 'cadastrar-usuario',
        title: 'Como Cadastrar um Usuário',
        intro: 'No menu lateral, vá em "Área do Administrador" e clique em "Usuários".',
        steps: [
          '**E-mail Institucional:** Digite o e-mail oficial (com final @sme.prefeitura.gov.br).',
          '**Registro Funcional (RF):** Informe o número de registro do servidor.',
          '**Nome Completo:** Insira o nome completo do novo usuário.',
          '**Função no Sistema:** Selecione no menu se a pessoa será "Professor" ou "Administrador" (aqui focado na gestão).',
          'Clique no botão "Cadastrar" (com o ícone de ✓) para finalizar.',
        ],
        image: {
          src: '/src/assets/help/cadastro_usuario.jpg',
          alt: 'Cadastro de Usuário',
        },
      },
      {
        id: 'editar-usuario',
        title: 'Como Editar um Usuário',
        intro: 'Para atualizar os dados de algum usuário cadastrado no sistema, siga o passo a passo ilustrado na imagem abaixo:',
        steps: [
          '**Selecione o Usuário:** Na tabela de usuários ativos, localize a pessoa que deseja alterar e clique no ícone de lápis na coluna "Ações", ao lado do nome dela.',
          '**Edite os Campos:** Ao clicar, o painel superior mudará para o modo "Edição de Usuário", trazendo todos os dados preenchidos automaticamente. Modifique as informações desejadas (como e-mail, RF, nome ou função no sistema).',
          '**Salve as Alterações:** Se estiver tudo certo, clique no botão azul "✓ Salvar" para confirmar e concluir a atualização.',
          '**Cancele se necessário:** Caso desista das alterações ou tenha clicado sem querer, basta clicar no botão "✕ Cancelar" para que o formulário volte ao estado normal sem salvar nada.',
        ],
        image: {
          src: '/src/assets/help/edicao_usuario.jpg',
          alt: 'Edição de Usuário',
        },
      },
      {
        id: 'inativar-usuario',
        title: 'Como Inativar um Usuário',
        intro: 'Se precisar inativar o acesso de algum usuário no sistema, faça o seguinte:',
        steps: [
          '**Clique para Inativar:** Na tabela, encontre o usuário e clique no botão vermelho com o "✕" localizado na coluna "Ações".',
          '**Confirme a Ação:** Uma janela de confirmação intitulada "Inativar Usuário" surgirá no centro da tela perguntando se você tem certeza de que deseja inativar a pessoa (isso evita desativações acidentais).',
          '**Conclua o Processo:** Clique no botão vermelho "Sim" para efetivar a inativação. Se mudar de ideia, clique em "Não" ou feche a janela no "✕" do canto superior direito para cancelar o processo.',
        ],
        alert: {
          type: 'info',
          message: 'Para reativar um usuário inativo, clique no botão verde com o ✓ na mesma coluna "Ações" e confirme em "Sim".',
        },
        image: {
          src: '/src/assets/help/desativar_usuario.jpg',
          alt: 'Inativar Usuário',
        },
      },
    ],
  },

  // ==========================================
  // MÓDULOS DE PROFESSOR
  // ==========================================
  {
    id: 'alunos-professor',
    title: 'Alunos',
    audience: ['professor'],
    description: 'Listagem dos alunos por turma e acesso ao portfólio de cada um.',
    topics: [
      {
        id: 'acessar-portfolio-aluno',
        title: 'Como Acessar o Portfólio do Aluno',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Professor" e, em seguida, selecione "Alunos".',
        steps: [
          '**Selecione a Turma:** No campo "Turma", escolha a turma desejada no menu suspenso.',
          '**Carregue os Alunos:** Clique no botão azul "Buscar" para exibir a listagem de estudantes daquela turma. Para redefinir a busca, clique em "Limpar Campos".',
          '**Acesse o Portfólio:** Na tabela exibida, localize o estudante desejado (se preferir, use o campo de busca acima da tabela) e clique no botão azul "Ver Portfólio" na coluna "Ações" para ser direcionado diretamente à tela do aluno.',
        ],
        image: {
          src: '/src/assets/help/acesso_portfolio.jpg',
          alt: 'Acesso ao Portfólio do Aluno',
        },
      },
      {
        id: 'navegar-portfolio-aluno',
        title: 'Navegando pelo Portfólio do Aluno',
        intro: 'Ao clicar em "Ver Portfólio" na tela de "Alunos" (Área do Professor → Alunos), o sistema abre a tela individual do estudante, reunindo dados cadastrais, anotações pedagógicas e o histórico completo de sondagens:',
        steps: [
          '**Perfil do Estudante:** Exibe os dados principais do aluno, como nome, turma, data de nascimento, número de chamada, matrícula, status e histórico escolar.',
          '**Anotações:** Permite registrar e acompanhar observações sobre o estudante (filtráveis por Conselho, Pedagógica ou Responsáveis). Para incluir um novo registro, clique no botão "+ Nova Anotação".',
          '**Linha do Tempo de Sondagens:** Mostra cronologicamente todas as sondagens realizadas pelo aluno, com opção de filtrar por eixo (Todos os Eixos, Escrita, Leitura e Matemática).',
          '**Acessar Evidência:** Em qualquer card da linha do tempo, clique em "Ver evidência" para abrir a janela com a foto da atividade e o resultado.',
          '**Acessar Histórico Completo:** Clique em "Ver Histórico Completo" no canto superior direito para ser direcionado diretamente à tela de listagem completa de sondagens daquele aluno.',
        ],
        image: {
          src: '/src/assets/help/portfolio_aluno.jpg',
          alt: 'Portfólio do Aluno',
        },
      },
      {
        id: 'visualizar-evidencia-sondagem',
        title: 'Como Visualizar e Baixar a Evidência da Sondagem',
        intro: 'Ao clicar em "Ver evidência", a janela "Evidência da Sondagem" é exibida na tela:',
        steps: [
          '**Visualize a Atividade:** Confira a foto da atividade realizada pelo estudante diretamente na área central da janela.',
          '**Confira o Resultado:** Na parte inferior esquerda, verifique o "Resultado" obtido pelo aluno naquela sondagem (ex.: Adequada).',
          '**Baixe o Arquivo:** Caso precise salvar ou imprimir a comprovação, clique no botão azul "Baixar arquivo" no canto inferior direito para fazer o download da evidência.',
        ],
        image: {
          src: '/src/assets/help/evidencia.jpg',
          alt: 'Janela Evidência da Sondagem',
        },
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
        id: 'iniciar-listar-sondagens',
        title: 'Como Iniciar ou Listar Sondagens',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Professor" e, em seguida, selecione "Sondagens".',
        steps: [
          '**Selecione a Turma:** No campo "Turma", escolha uma das turmas associadas ao seu perfil.',
          '**Carregue os Alunos:** Clique no botão azul "Buscar" para exibir a listagem de estudantes da turma selecionada na tabela abaixo. Para refazer a busca, clique em "Limpar Campos".',
          '**Para iniciar uma sondagem:** Na coluna "Ações" da linha do aluno, clique em "+ Criar" para abrir a janela de criação de uma nova sondagem para aquele aluno.',
          '**Para consultar o histórico:** Na mesma coluna, clique em "Listar" para ver todas as sondagens já realizadas por aquele aluno.',
        ],
        image: {
          src: '/src/assets/help/buscar_turma.jpg',
          alt: 'Iniciar ou Listar Sondagens',
        },
      },
      {
        id: 'criar-sondagem',
        title: 'Como Criar uma Nova Sondagem',
        intro: 'Ao clicar em "+ Criar", a janela "Nova Sondagem" será exibida:',
        steps: [
          '**Defina Matéria e Bimestre:** Selecione a "Matéria" e o "Bimestre" desejados nos respectivos menus suspensos. A lista de modelos passa a mostrar só os que combinam com essa escolha (a Matéria é opcional, o Bimestre é obrigatório).',
          '**Escolha o Modelo de Atividade:** No campo "Modelo de Atividade", selecione a atividade que será aplicada (os campos Ano Escolar e Eixo são preenchidos automaticamente conforme o modelo escolhido).',
          '**Baixe o Modelo (Opcional):** Caso precise imprimir ou visualizar o arquivo da atividade, clique em "Baixar Modelo de Atividade". O botão é liberado depois que o modelo é escolhido.',
          '**Inicie a Sondagem:** Clique no botão azul "Criar Sondagem" para concluir a criação e iniciar a avaliação do aluno.',
        ],
        image: {
          src: '/src/assets/help/cadastro_sondagem.jpg',
          alt: 'Criar Sondagem',
        },
      },
      {
        id: 'historico-sondagens-aluno',
        title: 'Histórico de Sondagens do Aluno',
        intro: 'Ao clicar em "Listar" na linha de um aluno na tela de "Sondagens" (Área do Professor → Sondagens), o sistema exibe o histórico completo de avaliações daquele estudante. Você pode filtrar os resultados por "Status", "Matéria", "Eixo" ou "Bimestre" e clicar em "Buscar", ou gerenciar cada sondagem diretamente na coluna "Ações":',
        steps: [
          '**Visualizar e Baixar o Modelo:** Clique no ícone de olho para visualizar e baixar o modelo de atividade referente àquela sondagem.',
          '**Excluir Sondagem:** Clique no botão vermelho com o "✕" para excluir o registro.',
          '**Finalizar Sondagem:** Clique no botão azul "Finalizar" para concluir uma sondagem que ainda esteja "Em Aberto".',
          '**Acionar Sondagem Digital:** Clique no último botão azul à direita para abrir e executar a versão digital da sondagem. Depois de iniciada, esse botão passa a ser o de finalizar a sondagem digital (ícone de quadrado com um visto).',
        ],
        alert: {
          type: 'warning',
          message: 'Apenas sondagens não finalizadas (Em Aberto) podem ser excluídas.',
        },
        image: {
          src: '/src/assets/help/historico_sondagens.jpg',
          alt: 'Histórico de Sondagens',
        },
      },
      {
        id: 'iniciar-sondagem-digital',
        title: 'Como Iniciar uma Sondagem Digital',
        steps: [
          'Dentro do histórico do aluno, localize a sondagem e clique no botão azul com ícone de folha e caneta.',
          'Na janela "Deseja realizar a sondagem digitalmente?", clique em "Sim".',
          'Leia as instruções e clique em "Entendi". (Marque "Não exibir novamente" para pular essa etapa nas próximas vezes).',
          'Na janela seguinte aparecem o QR Code e o link para abrir a sondagem no tablet do aluno.',
        ],
      },
      {
        id: 'abrir-sondagem-tablet',
        title: 'Como Abrir a Sondagem no Tablet do Aluno',
        steps: [
          'Na janela com o QR Code e o link, escolha uma das formas abaixo:',
          'Pelo QR Code (mais rápido): abra a câmera do tablet, aponte para o QR Code na tela e toque no link que aparecer.',
          'Copiando o link: clique no ícone de copiar ao lado do endereço para enviá-lo ao tablet (por WhatsApp, e-mail ou aplicativo de mensagens).',
          'Digitando no navegador: abra o navegador do tablet (Chrome, Safari, etc.) e digite exatamente o endereço exibido na tela.',
        ],
        alert: {
          type: 'info',
          message: 'Assim que o aluno abrir o link, a sondagem já estará pronta para responder.',
        },
      },
      {
        id: 'responder-sondagem-tablet',
        title: 'Como o Aluno Responde no Tablet',
        steps: [
          'O aluno digita a resposta no teclado da própria tela: letras nas atividades de Português e números nas de Matemática.',
          'O botão de apagar remove a última letra ou número digitado.',
          'A resposta é salva automaticamente a cada toque. Não é preciso clicar em salvar.',
        ],
        alert: {
          type: 'info',
          message: 'Se a internet do tablet cair, a tela avisa e tenta salvar a resposta de novo sozinha.',
        },
      },
      {
        id: 'finalizar-sondagem-digital',
        title: 'Como Finalizar uma Sondagem Digital',
        steps: [
          'Quando o aluno terminar, volte ao histórico do aluno e localize a sondagem.',
          'Clique no botão azul com ícone de quadrado com um visto (✓).',
          'Na janela "Deseja finalizar a sondagem digital?", clique em "Sim".',
        ],
        alert: {
          type: 'warning',
          message: 'Depois de finalizada, a resposta fica travada e o aluno não consegue mais alterá-la no tablet.',
        },
      },
      {
        id: 'finalizar-inserir-resultados',
        title: 'Como Finalizar e Inserir Resultados',
        steps: [
          'Dentro do histórico do aluno, localize a sondagem e clique em "Finalizar".',
          'Insira o resultado, digite suas observações e anexe a evidência (foto ou arquivo da atividade realizada).',
        ],
      },
      {
        id: 'visualizar-sondagem-finalizada',
        title: 'Como Visualizar uma Sondagem Finalizada',
        steps: [
          'No histórico, clique no ícone de olho ao lado da sondagem concluída.',
          'Verifique o status da avaliação ou faça o download da atividade anexada.',
        ],
      },
    ],
  },
  {
    id: 'trajetorias-aprendizagem',
    title: 'Trajetórias de Aprendizagem',
    audience: ['professor'],
    description: 'Acompanhamento da evolução dos níveis dos alunos ao longo do ano letivo.',
    topics: [
      {
        id: 'consultar-trajetorias',
        title: 'Como Consultar Trajetórias de Aprendizagem',
        intro: '**Acesse a Tela:** No menu lateral esquerdo, clique em "Área do Professor" e, em seguida, selecione "Trajetórias".',
        steps: [
          '**Selecione os Filtros:** Nos menus suspensos no topo da tela, escolha a "Turma", a "Matéria" e o "Eixo" que deseja consultar.',
          '**Carregue a Listagem:** Clique no botão azul "Buscar" para exibir os resultados. Para redefinir os filtros, clique em "Limpar Campos".',
          '**Acompanhe a Evolução:** Na tabela "Trajetórias de Aprendizagem", visualize o desempenho de cada estudante distribuído por período: "Inicial", "1º Bim", "2º Bim", "3º Bim", "4º Bim" e "Atual".',
        ],
        alert: {
          type: 'info',
          message: 'A legenda abaixo da tabela explica o que significa cada sigla. Clique no nome de um aluno para abrir o portfólio dele.',
        },
        image: {
          src: '/src/assets/help/trajetorias.jpg',
          alt: 'Trajetórias de Aprendizagem',
        },
      },
    ],
  },
];
