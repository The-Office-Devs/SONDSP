-- 1. Atualizar a tabela permissao com descricao e area
ALTER TABLE permissao ADD COLUMN IF NOT EXISTS descricao VARCHAR(255);
ALTER TABLE permissao ADD COLUMN IF NOT EXISTS area VARCHAR(100);

-- Limpar vínculos legados de permissao_x_usuario e funcao_x_permissao
DELETE FROM funcao_x_permissao;
DROP TABLE IF EXISTS permissao_x_usuario;
DELETE FROM permissao;

-- 2. Inserir catálogo completo de permissões com ações correlacionadas unificadas
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

('ESCOLA_MANAGE', 'Cadastrar e Editar Escolas', 'Escolas'),
('ESCOLA_VIEW', 'Visualizar Escolas', 'Escolas'),
('ESCOLA_STATUS', 'Ativar / Desativar Escolas', 'Escolas'),

('ATIVIDADE_MANAGE', 'Cadastrar e Editar Atividades', 'Atividades'),
('ATIVIDADE_VIEW', 'Visualizar Atividades', 'Atividades'),
('ATIVIDADE_STATUS', 'Ativar / Desativar Atividades', 'Atividades'),

('USUARIO_MANAGE', 'Cadastrar e Editar Usuários', 'Usuários'),
('USUARIO_VIEW', 'Visualizar Usuários', 'Usuários'),
('USUARIO_STATUS', 'Ativar / Desativar Usuários', 'Usuários'),
('USUARIO_VINCULAR', 'Vincular Turmas e Escolas a Usuários', 'Usuários'),

('PORTFOLIO_ANOTACOES_MANAGE', 'Gerenciar Anotações de Estudantes', 'Anotações / Portfólio'),
('TURMA_ANOTACOES_MANAGE', 'Gerenciar Anotações de Turmas', 'Anotações / Portfólio'),
('PORTFOLIO_VIEW', 'Visualizar Portfólio e Timeline', 'Anotações / Portfólio'),

('FUNCAO_MANAGE', 'Criar e Editar Funções', 'Funções e Permissões'),
('FUNCAO_VIEW', 'Visualizar Funções', 'Funções e Permissões');

-- 3. Garantir a existência da função ADMIN
INSERT INTO funcao (nome)
SELECT 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM funcao WHERE UPPER(nome) IN ('ADMIN', 'ADMINISTRADOR')
);

-- 4. Vincular todas as permissões para a função ADMIN (irrevogável)
INSERT INTO funcao_x_permissao (id_funcao, id_permissao)
SELECT f.id, p.id
FROM funcao f
CROSS JOIN permissao p
WHERE UPPER(f.nome) IN ('ADMIN', 'ADMINISTRADOR')
ON CONFLICT DO NOTHING;

-- 5. Vincular permissões padrão para funções existentes
-- Professor
INSERT INTO funcao_x_permissao (id_funcao, id_permissao)
SELECT f.id, p.id
FROM funcao f
JOIN permissao p ON p.permissao IN (
    'SONDAGEM_MANAGE', 'SONDAGEM_VIEW',
    'ALUNO_VIEW', 'TURMA_VIEW', 'ATIVIDADE_VIEW',
    'PORTFOLIO_VIEW', 'PORTFOLIO_ANOTACOES_MANAGE', 'TURMA_ANOTACOES_MANAGE'
)
WHERE UPPER(f.nome) = 'PROFESSOR'
ON CONFLICT DO NOTHING;

-- Coordenador
INSERT INTO funcao_x_permissao (id_funcao, id_permissao)
SELECT f.id, p.id
FROM funcao f
JOIN permissao p ON p.permissao IN (
    'SONDAGEM_MANAGE', 'SONDAGEM_VIEW', 'SONDAGEM_EXPORT',
    'ALUNO_VIEW', 'TURMA_VIEW', 'ATIVIDADE_VIEW',
    'PORTFOLIO_VIEW', 'PORTFOLIO_ANOTACOES_MANAGE', 'TURMA_ANOTACOES_MANAGE'
)
WHERE UPPER(f.nome) IN ('COORDENADOR', 'COORDINATOR')
ON CONFLICT DO NOTHING;

-- Administrador Escolar
INSERT INTO funcao_x_permissao (id_funcao, id_permissao)
SELECT f.id, p.id
FROM funcao f
JOIN permissao p ON p.permissao IN (
    'SONDAGEM_MANAGE', 'SONDAGEM_VIEW', 'SONDAGEM_EXPORT',
    'ALUNO_MANAGE', 'ALUNO_VIEW', 'ALUNO_IMPORT', 'ALUNO_STATUS',
    'TURMA_MANAGE', 'TURMA_VIEW', 'TURMA_STATUS',
    'PORTFOLIO_VIEW', 'PORTFOLIO_ANOTACOES_MANAGE', 'TURMA_ANOTACOES_MANAGE'
)
WHERE UPPER(f.nome) IN ('ADMIN_ESCOLA', 'ADMINISTRADOR DA ESCOLA')
ON CONFLICT DO NOTHING;

-- POA
INSERT INTO funcao_x_permissao (id_funcao, id_permissao)
SELECT f.id, p.id
FROM funcao f
JOIN permissao p ON p.permissao IN (
    'SONDAGEM_MANAGE', 'SONDAGEM_VIEW',
    'ALUNO_VIEW', 'TURMA_VIEW', 'ATIVIDADE_VIEW',
    'PORTFOLIO_VIEW'
)
WHERE UPPER(f.nome) = 'POA'
ON CONFLICT DO NOTHING;

-- 6. Criar tabela de relacionamento N:N usuario_x_funcao
CREATE TABLE IF NOT EXISTS usuario_x_funcao (
    id_usuario INTEGER NOT NULL,
    id_funcao  INTEGER NOT NULL,
    CONSTRAINT c_pk_usuario_funcao PRIMARY KEY (id_usuario, id_funcao),
    CONSTRAINT c_fk_usuario_funcao_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT c_fk_usuario_funcao_funcao FOREIGN KEY (id_funcao) REFERENCES funcao (id) ON DELETE RESTRICT
);

-- 7. Migrar funções existentes dos usuários
INSERT INTO usuario_x_funcao (id_usuario, id_funcao)
SELECT id, id_funcao FROM usuario WHERE id_funcao IS NOT NULL
ON CONFLICT DO NOTHING;

-- 8. Remover restrição e coluna antiga id_funcao da tabela usuario
ALTER TABLE usuario DROP CONSTRAINT IF EXISTS c_fk_usuario_funcao;
ALTER TABLE usuario DROP COLUMN IF EXISTS id_funcao;
