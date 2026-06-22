-- Adiciona coluna de status para alunos
ALTER TABLE aluno
ADD COLUMN  status     BOOLEAN    NOT NULL DEFAULT FALSE;

-- Adiciona colunas diretor e status para a escola
ALTER TABLE escola
ADD COLUMN  diretor VARCHAR(255),
ADD COLUMN  status     BOOLEAN    NOT NULL DEFAULT FALSE;

-- Atualiza a nova coluna com um valor padrão para os registros atuais
UPDATE escola
SET    diretor = 'Sem diretor';

-- Deixa a coluna como NOT NULL
ALTER TABLE escola
ALTER COLUMN diretor SET NOT NULL;

-- Adiciona os campos ano_letivo e status para turma
ALTER TABLE turma
ADD COLUMN  ano_letivo VARCHAR(4),
ADD COLUMN  status     BOOLEAN     NOT NULL DEFAULT FALSE;

-- Atualiza a nova coluna com um valor padrão para os registros atuais
UPDATE turma
SET    ano_letivo = '2026';

-- Deixa a coluna como NOT NULL
ALTER TABLE turma
ALTER COLUMN ano_letivo SET NOT NULL;