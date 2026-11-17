DELETE FROM funcao_x_permissao;
DELETE FROM permissao;
DELETE FROM funcao;

-- Só pode haver uma função com o nome
ALTER TABLE funcao ADD CONSTRAINT c_uq_funcao_nome UNIQUE (nome);

-- Altera tabela de permissao
ALTER TABLE permissao ADD COLUMN IF NOT EXISTS descricao VARCHAR(255);
ALTER TABLE permissao ADD COLUMN IF NOT EXISTS area VARCHAR(100);
ALTER TABLE permissao ADD CONSTRAINT c_uq_permissao_permissao UNIQUE (permissao);

DROP TABLE permissao_x_usuario;

INSERT INTO permissao (permissao, descricao, area) VALUES
   ('SONDAGEM_MANAGE', 'Gerenciar Sondagens (Abertura e Fechamento)', 'Sondagens'),
   ('SONDAGEM_VIEW', 'Visualizar Sondagens', 'Sondagens'),
   ('SONDAGEM_DELETE', 'Excluir / Desativar Sondagem', 'Sondagens'),
   ('SONDAGEM_EXPORT', 'Exportar Relatórios de Sondagens', 'Sondagens'),

   ('ALUNO_MANAGE', 'Cadastrar e Editar Alunos', 'Alunos'),
   ('ALUNO_VIEW', 'Visualizar Alunos', 'Alunos'),
   ('ALUNO_IMPORT', 'Importar Alunos em Lote', 'Alunos'),
   ('ALUNO_STATUS', 'Ativar / Desativar Alunos', 'Alunos'),

   ('TURMA_MANAGE', 'Cadastrar e Editar Turmas', 'Turmas'),
   ('TURMA_VIEW', 'Visualizar Turmas e Mapas', 'Turmas'),
   ('TURMA_STATUS', 'Ativar / Desativar Turmas', 'Turmas'),

   ('ATIVIDADE_MANAGE', 'Cadastrar e Editar Atividades', 'Atividades'),
   ('ATIVIDADE_VIEW', 'Visualizar Atividades', 'Atividades'),
   ('ATIVIDADE_STATUS', 'Ativar / Desativar Atividades', 'Atividades'),

   ('USUARIO_MANAGE', 'Cadastrar e Editar Usuários', 'Usuários'),
   ('USUARIO_VIEW', 'Visualizar Usuários', 'Usuários'),
   ('USUARIO_STATUS', 'Ativar / Desativar Usuários', 'Usuários'),
   ('USUARIO_VINCULAR_TURMA', 'Vincular Turmas a Usuários', 'Usuários'),
   ('USUARIO_VINCULAR_ESCOLA', 'Vincular Escolas a Usuários', 'Usuários'),

   ('PORTFOLIO_ANOTACOES_MANAGE', 'Gerenciar Anotações de Estudantes', 'Anotações / Portfólio'),
   ('TURMA_ANOTACOES_MANAGE', 'Gerenciar Anotações de Turmas', 'Anotações / Portfólio'),
   ('PORTFOLIO_VIEW', 'Visualizar Portfólio e Timeline', 'Anotações / Portfólio'),

   ('FUNCAO_MANAGE', 'Criar e Editar Funções', 'Funções e Permissões'),
   ('FUNCAO_VIEW', 'Visualizar Funções', 'Funções e Permissões');

INSERT INTO funcao (id, nome) OVERRIDING SYSTEM VALUE VALUES (1, 'Administrador');

INSERT INTO funcao_x_permissao (id_funcao, id_permissao)
SELECT 1,
       id
FROM   permissao;