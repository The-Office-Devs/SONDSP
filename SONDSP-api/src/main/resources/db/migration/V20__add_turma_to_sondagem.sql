-- 1. Adiciona a coluna id_turma na tabela sondagem
ALTER TABLE sondagem
    ADD COLUMN id_turma INTEGER;

-- 2. Preenche a turma a partir da turma em que o aluno está vinculado (ou primeira turma como fallback)
UPDATE sondagem s
SET id_turma = (
    SELECT COALESCE(a.id_turma, (SELECT min(id) FROM turma))
    FROM aluno a
    WHERE a.id = s.id_aluno
)
WHERE s.id_turma IS NULL;

-- 3. Define a coluna como NOT NULL
ALTER TABLE sondagem
    ALTER COLUMN id_turma SET NOT NULL;

-- 4. Cria a constraint de chave estrangeira referenciando turma(id)
ALTER TABLE sondagem
    ADD CONSTRAINT c_fk_sondagem_turma FOREIGN KEY (id_turma) REFERENCES turma (id);

-- 5. Cria índice para otimização de consultas por turma
CREATE INDEX ix_sondagem_turma ON sondagem (id_turma);
