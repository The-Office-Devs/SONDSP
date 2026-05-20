CREATE TABLE funcao (
  id       INTEGER      GENERATED ALWAYS AS IDENTITY,
  nome     VARCHAR(100) not null,

  CONSTRAINT c_pk_funcao PRIMARY KEY (id)
);

CREATE TABLE usuario (
  id        INTEGER       GENERATED ALWAYS AS IDENTITY,
  nome      VARCHAR(255)  NOT NULL,
  matricula VARCHAR(50)   NOT NULL  UNIQUE,
  id_funcao  INTEGER,
  email     VARCHAR(255)  NOT NULL  UNIQUE,
  status    BOOLEAN       NOT NULL  DEFAULT TRUE,
  senha     VARCHAR(255)  NOT NULL,

  CONSTRAINT c_pk_usuario         PRIMARY KEY (id),
  CONSTRAINT c_fk_usuario_funcao  FOREIGN KEY (id_funcao) REFERENCES funcao (id)
);

CREATE TABLE escola (
  id   INTEGER      GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,

  CONSTRAINT c_pk_escola PRIMARY KEY (id)
);

CREATE TABLE usuario_x_escola (
  id_usuario INTEGER      NOT NULL,
  id_escola  INTEGER      NOT NULL,
  atuacao   VARCHAR(255) NOT NULL,

  CONSTRAINT c_pk_usuario_escola         PRIMARY KEY (id_usuario, id_escola),
  CONSTRAINT c_fk_usuario_escola_usuario FOREIGN KEY (id_usuario)  REFERENCES usuario (id),
  CONSTRAINT c_fk_usuario_escola_turma   FOREIGN KEY (id_escola)   REFERENCES escola (id)
);

CREATE TABLE turma (
  id       INTEGER GENERATED ALWAYS AS IDENTITY,
  id_escola INTEGER      NOT NULL,
  nome     VARCHAR(100) NOT NULL,

  CONSTRAINT c_pk_turma            PRIMARY KEY (id),
  CONSTRAINT c_fk_turma_escola     FOREIGN KEY (id_escola) REFERENCES escola (id),

  CONSTRAINT c_u_turma_escola_nome UNIQUE (id_escola, nome)
);

CREATE TABLE usuario_x_turma (
  id_usuario INTEGER      NOT NULL,
  id_turma   INTEGER      NOT NULL,
  atuacao   VARCHAR(255) NOT NULL,

  CONSTRAINT c_pk_usuario_turma         PRIMARY KEY (id_usuario, id_turma),
  CONSTRAINT c_fk_usuario_turma_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id),
  CONSTRAINT c_fk_usuario_turma_turma   FOREIGN KEY (id_turma)   REFERENCES turma (id)
);

CREATE TABLE aluno (
  id         INTEGER      GENERATED ALWAYS AS IDENTITY,
  nome       VARCHAR(255) NOT NULL,
  matricula  VARCHAR(50)  NOT NULL  UNIQUE,
  id_turma    INTEGER,
  cod_acesso  VARCHAR(50),
  num_chamada INTEGER,

  CONSTRAINT c_pk_aluno       PRIMARY KEY (id),
  CONSTRAINT c_fk_aluno_turma FOREIGN KEY (id_turma) REFERENCES turma (id)
);

CREATE TABLE atividade (
  id         INTEGER      GENERATED ALWAYS AS IDENTITY,
  id_criador  INTEGER      NOT NULL,
  nome       VARCHAR(255) NOT NULL,
  materia    VARCHAR(100) NOT NULL,
  eixo       VARCHAR(100) NOT NULL,
  modelo     VARCHAR(255) UNIQUE,

  CONSTRAINT c_pk_atividade         PRIMARY KEY (id),
  CONSTRAINT c_fk_atividade_usuario FOREIGN KEY (id_criador) REFERENCES usuario (id)
);

CREATE TABLE sondagem (
  id             INTEGER GENERATED ALWAYS AS IDENTITY,
  id_aplicador    INTEGER        NOT NULL,
  id_aluno        INTEGER        NOT NULL,
  materia        VARCHAR(100)   NOT NULL,
  eixo           VARCHAR(100)   NOT NULL,
  resultado      VARCHAR(2500),
  observacoes    TEXT,
  imagem_sondagem VARCHAR(255)   UNIQUE,
  ind_digital     CHAR(1),
  id_atividade    INTEGER,

  CONSTRAINT c_pk_sondagem           PRIMARY KEY (id),
  CONSTRAINT c_fk_sondagem_usuario   FOREIGN KEY (id_aplicador) REFERENCES usuario   (id),
  CONSTRAINT c_fk_sondagem_aluno     FOREIGN KEY (id_aluno)     REFERENCES aluno     (id),
  CONSTRAINT c_fk_sondagem_atividade FOREIGN KEY (id_atividade) REFERENCES atividade (id)
);

CREATE TABLE permissao (
  id        INTEGER      GENERATED ALWAYS AS IDENTITY,
  permissao VARCHAR(100) NOT NULL,

  CONSTRAINT c_pk_permissao PRIMARY KEY (id)
);

CREATE TABLE permissao_x_usuario (
  id_permissao INTEGER NOT NULL,
  id_usuario   INTEGER NOT NULL,

  CONSTRAINT c_pk_permissao_usuario            PRIMARY KEY (id_permissao, id_usuario),
  CONSTRAINT c_fk_permissao_usuario_usuario    FOREIGN KEY (id_usuario)   REFERENCES usuario (id),
  CONSTRAINT c_fk_permissao_usuario_permissao  FOREIGN KEY (id_permissao) REFERENCES permissao (id)
);

CREATE TABLE funcao_x_permissao (
  id_funcao    INTEGER NOT NULL,
  id_permissao INTEGER NOT NULL,

  CONSTRAINT c_pk_funcao_permissao            PRIMARY KEY (id_funcao, id_permissao),
  CONSTRAINT c_fk_funcao_permissao_funcao     FOREIGN KEY (id_funcao)    REFERENCES funcao (id),
  CONSTRAINT c_fk_funcao_permissao_permissao  FOREIGN KEY (id_permissao) REFERENCES permissao (id)
);

INSERT INTO funcao (nome)
VALUES ('ADMIN'),
       ('ADMIN_ESCOLA'),
       ('COORDENADOR'),
       ('PROFESSOR'),
       ('POA');

INSERT INTO permissao(permissao)
VALUES ('CREATE_USER'),
       ('UPDATE_USER'),
       ('DELETE_USER');
