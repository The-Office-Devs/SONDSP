CREATE TABLE funcao (
  id       INTEGER GENERATED ALWAYS AS IDENTITY,
  nome     VARCHAR(100) not null,

  CONSTRAINT c_pk_funcao PRIMARY KEY (id)
);

CREATE TABLE usuario (
  id        INTEGER       GENERATED ALWAYS AS IDENTITY,
  nome      VARCHAR(255)  NOT NULL,
  matricula VARCHAR(50)   NOT NULL  UNIQUE,
  idFuncao  INTEGER,
  email     VARCHAR(255)  NOT NULL  UNIQUE,
  status    BOOLEAN       NOT NULL  DEFAULT TRUE,
  senha     VARCHAR(255)  NOT NULL,

  CONSTRAINT c_pk_usuario         PRIMARY KEY (id),
  CONSTRAINT c_fk_usuario_funcao  FOREIGN KEY (idFuncao) REFERENCES funcao (id)
);

CREATE TABLE escola (
  id   INTEGER      GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,

  CONSTRAINT c_pk_escola PRIMARY KEY (id)
);

CREATE TABLE usuario_x_escola (
  idUsuario INTEGER      NOT NULL,
  idEscola  INTEGER      NOT NULL,
  atuacao   VARCHAR(255) NOT NULL,

  CONSTRAINT c_pk_usuario_escola         PRIMARY KEY (idUsuario, idEscola),
  CONSTRAINT c_fk_usuario_escola_usuario FOREIGN KEY (idUsuario)  REFERENCES usuario (id),
  CONSTRAINT c_fk_usuario_escola_turma   FOREIGN KEY (idEscola)   REFERENCES escola (id)
);

CREATE TABLE turma (
  id       INTEGER GENERATED ALWAYS AS IDENTITY,
  idEscola INTEGER      NOT NULL,
  nome     VARCHAR(100) NOT NULL,

  CONSTRAINT c_pk_turma            PRIMARY KEY (id),
  CONSTRAINT c_fk_turma_escola     FOREIGN KEY (idEscola) REFERENCES escola (id),

  CONSTRAINT c_u_turma_escola_nome UNIQUE (idEscola, nome)
);

CREATE TABLE usuario_x_turma (
  idUsuario INTEGER      NOT NULL,
  idTurma   INTEGER      NOT NULL,
  atuacao   VARCHAR(255) NOT NULL,

  CONSTRAINT c_pk_usuario_turma         PRIMARY KEY (idUsuario, idTurma),
  CONSTRAINT c_fk_usuario_turma_usuario FOREIGN KEY (idUsuario) REFERENCES usuario (id),
  CONSTRAINT c_fk_usuario_turma_turma   FOREIGN KEY (idTurma)   REFERENCES turma (id)
);

CREATE TABLE aluno (
  id         INTEGER      GENERATED ALWAYS AS IDENTITY,
  nome       VARCHAR(255) NOT NULL,
  matricula  VARCHAR(50)  NOT NULL  UNIQUE,
  idTurma    INTEGER,
  codAcesso  VARCHAR(50),
  numChamada INTEGER,

  CONSTRAINT c_pk_aluno       PRIMARY KEY (id),
  CONSTRAINT c_fk_aluno_turma FOREIGN KEY (idTurma) REFERENCES turma (id)
);

CREATE TABLE atividade (
  id         INTEGER      GENERATED ALWAYS AS IDENTITY,
  idCriador  INTEGER      NOT NULL,
  nome       VARCHAR(255) NOT NULL,
  materia    VARCHAR(100) NOT NULL,
  eixo       VARCHAR(100) NOT NULL,
  modelo     VARCHAR(255) UNIQUE,

  CONSTRAINT c_pk_atividade         PRIMARY KEY (id),
  CONSTRAINT c_fk_atividade_usuario FOREIGN KEY (idCriador) REFERENCES usuario (id)
);

CREATE TABLE sondagem (
  id             INTEGER GENERATED ALWAYS AS IDENTITY,
  idAplicador    INTEGER        NOT NULL,
  idAluno        INTEGER        NOT NULL,
  materia        VARCHAR(100)   NOT NULL,
  eixo           VARCHAR(100)   NOT NULL,
  resultado      VARCHAR(2500),
  observacoes    TEXT,
  imagemSondagem VARCHAR(255)   UNIQUE,
  indDigital     CHAR(1),
  idAtividade    INTEGER,

  CONSTRAINT c_pk_sondagem           PRIMARY KEY (id),
  CONSTRAINT c_fk_sondagem_usuario   FOREIGN KEY (idAplicador) REFERENCES usuario   (id),
  CONSTRAINT c_fk_sondagem_aluno     FOREIGN KEY (idAluno)     REFERENCES aluno     (id),
  CONSTRAINT c_fk_sondagem_atividade FOREIGN KEY (idAtividade) REFERENCES atividade (id)
);

CREATE TABLE permissao (
  id        INTEGER      GENERATED ALWAYS AS IDENTITY,
  permissao VARCHAR(100) NOT NULL,

  CONSTRAINT c_pk_permissao PRIMARY KEY (id)
);

CREATE TABLE permissao_x_usuario (
  idPermissao INTEGER NOT NULL,
  idUsuario   INTEGER NOT NULL,

  CONSTRAINT c_pk_permissao_usuario            PRIMARY KEY (idPermissao, idUsuario),
  CONSTRAINT c_fk_permissao_usuario_usuario    FOREIGN KEY (idUsuario)   REFERENCES usuario (id),
  CONSTRAINT c_fk_permissao_usuario_permissao  FOREIGN KEY (idPermissao) REFERENCES permissao (id)
);

CREATE TABLE funcao_x_permissao (
  idFuncao    INTEGER NOT NULL,
  idPermissao INTEGER NOT NULL,

  CONSTRAINT c_pk_funcao_permissao            PRIMARY KEY (idFuncao, idPermissao),
  CONSTRAINT c_fk_funcao_permissao_funcao     FOREIGN KEY (idFuncao)    REFERENCES funcao (id),
  CONSTRAINT c_fk_funcao_permissao_permissao  FOREIGN KEY (idPermissao) REFERENCES permissao (id)
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
