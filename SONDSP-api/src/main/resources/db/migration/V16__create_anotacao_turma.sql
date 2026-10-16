CREATE TABLE anotacao_turma (
    id             INTEGER   NOT NULL,
    id_turma       INTEGER   NOT NULL,
    id_autor       INTEGER   NOT NULL,
    texto_anotacao TEXT      NOT NULL,
    data_criacao   TIMESTAMP NOT NULL,

    CONSTRAINT c_pk_anotacao_turma         PRIMARY KEY (id, id_turma),
    CONSTRAINT c_fk_anotacao_turma_turma   FOREIGN KEY (id_turma) REFERENCES turma (id),
    CONSTRAINT c_fk_anotacao_turma_usuario FOREIGN KEY (id_autor) REFERENCES usuario (id)
);