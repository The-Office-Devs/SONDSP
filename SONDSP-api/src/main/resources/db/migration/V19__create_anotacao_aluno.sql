CREATE TABLE anotacao_aluno (
    id               INTEGER      GENERATED ALWAYS AS IDENTITY,
    id_aluno         INTEGER      NOT NULL,
    id_autor         INTEGER      NOT NULL,
    texto_anotacao   TEXT         NOT NULL,
    data_criacao     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP,

    CONSTRAINT c_pk_anotacao_aluno         PRIMARY KEY (id),
    CONSTRAINT c_fk_anotacao_aluno_aluno   FOREIGN KEY (id_aluno) REFERENCES aluno (id),
    CONSTRAINT c_fk_anotacao_aluno_usuario FOREIGN KEY (id_autor) REFERENCES usuario (id),
    CONSTRAINT c_ck_anotacao_aluno_texto   CHECK (length(btrim(texto_anotacao)) BETWEEN 1 AND 2000)
);

CREATE INDEX ix_anotacao_aluno_aluno_data ON anotacao_aluno (id_aluno, data_criacao DESC);
CREATE INDEX ix_anotacao_aluno_autor ON anotacao_aluno (id_autor);

CREATE TABLE anotacao_aluno_x_tag (
    id_anotacao INTEGER     NOT NULL,
    tag         VARCHAR(20) NOT NULL,

    CONSTRAINT c_pk_anotacao_aluno_tag          PRIMARY KEY (id_anotacao, tag),
    CONSTRAINT c_fk_anotacao_aluno_tag_anotacao FOREIGN KEY (id_anotacao) REFERENCES anotacao_aluno (id) ON DELETE CASCADE,
    CONSTRAINT c_ck_anotacao_aluno_tag          CHECK (tag IN ('CONSELHO', 'PEDAGOGICA', 'RESPONSAVEIS'))
);

CREATE INDEX ix_anotacao_aluno_tag ON anotacao_aluno_x_tag (tag);
