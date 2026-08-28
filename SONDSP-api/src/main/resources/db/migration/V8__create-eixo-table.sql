CREATE TABLE eixo (
    id          INTEGER         GENERATED ALWAYS AS IDENTITY,
    nome        VARCHAR(255)    NOT NULL,
    materia     VARCHAR(255)    NOT NULL,
    ativo      BOOLEAN         NOT NULL,

    CONSTRAINT c_pk_eixo PRIMARY KEY (id)
);