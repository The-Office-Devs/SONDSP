CREATE TABLE aluno_x_turma (
    id                INTEGER      GENERATED ALWAYS AS IDENTITY,
    id_aluno          INTEGER      NOT NULL,
    id_turma          INTEGER,
    ano_letivo        VARCHAR(4)   NOT NULL,
    descricao_externa VARCHAR(255),
    status_matricula  VARCHAR(20)  NOT NULL,
    data_inicio       DATE,
    data_fim          DATE,

    CONSTRAINT c_pk_aluno_x_turma        PRIMARY KEY (id),
    CONSTRAINT c_fk_aluno_x_turma_aluno  FOREIGN KEY (id_aluno) REFERENCES aluno (id),
    CONSTRAINT c_fk_aluno_x_turma_turma  FOREIGN KEY (id_turma) REFERENCES turma (id),
    CONSTRAINT c_ck_aluno_x_turma_status CHECK (status_matricula IN ('CURSANDO', 'CONCLUIDO', 'TRANSFERIDO', 'REMANEJADO')),
    CONSTRAINT c_ck_aluno_x_turma_origem CHECK (id_turma IS NOT NULL OR descricao_externa IS NOT NULL),
    CONSTRAINT c_ck_aluno_x_turma_datas  CHECK (data_fim IS NULL OR data_inicio IS NULL OR data_fim >= data_inicio)
);

CREATE UNIQUE INDEX ux_aluno_x_turma_cursando ON aluno_x_turma (id_aluno) WHERE status_matricula = 'CURSANDO';
CREATE INDEX ix_aluno_x_turma_aluno_ano ON aluno_x_turma (id_aluno, ano_letivo DESC);
CREATE INDEX ix_aluno_x_turma_turma ON aluno_x_turma (id_turma);

-- Popula o vínculo ativo atual a partir das turmas correntes dos alunos cadastrados
INSERT INTO aluno_x_turma (id_aluno, id_turma, ano_letivo, status_matricula, data_inicio)
SELECT 
    a.id, 
    a.id_turma, 
    t.ano_letivo, 
    'CURSANDO', 
    CURRENT_DATE
FROM aluno a
JOIN turma t ON t.id = a.id_turma
WHERE a.id_turma IS NOT NULL
ON CONFLICT DO NOTHING;
