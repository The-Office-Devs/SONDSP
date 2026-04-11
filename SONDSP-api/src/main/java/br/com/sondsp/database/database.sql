CREATE TABLE tblEscola (
    idEscola SERIAL PRIMARY KEY,
    nome VARCHAR(255)
);

CREATE TABLE tblTurma (
    idTurma SERIAL PRIMARY KEY,
    idEscola INTEGER,
    nome VARCHAR(100),
    CONSTRAINT FK_Turma_Escola FOREIGN KEY (idEscola) REFERENCES tblEscola (idEscola)
);

CREATE TABLE tblAluno (
    idAluno SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    matricula VARCHAR(50),
    idTurma INTEGER,
    codAcesso VARCHAR(50),
    numChamada INTEGER,
    UNIQUE (matricula),
    CONSTRAINT FK_Aluno_Turma FOREIGN KEY (idTurma) REFERENCES tblTurma (idTurma)
);

CREATE TABLE tblUsuario (
    idUsuario SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(14),
    matricula VARCHAR(50),
    username VARCHAR(100),
    role VARCHAR(50),
    email VARCHAR(255),
    status BOOLEAN,
    password VARCHAR(255),
    UNIQUE (cpf, email, matricula)
);

CREATE TABLE tblUsuarioTurma (
    idUsuarioTurma SERIAL PRIMARY KEY,
    idUsuario INTEGER,
    idTurma INTEGER,
    CONSTRAINT FK_UserTurma_User FOREIGN KEY (idUsuario) REFERENCES tblUsuario (idUsuario),
    CONSTRAINT FK_UserTurma_Turma FOREIGN KEY (idTurma) REFERENCES tblTurma (idTurma)
);

CREATE TABLE tblUsuarioEscola (
    idUsuarioEscola SERIAL PRIMARY KEY,
    idUsuario INTEGER,
    idEscola INTEGER,
    CONSTRAINT FK_UserEscola_User FOREIGN KEY (idUsuario) REFERENCES tblUsuario (idUsuario),
    CONSTRAINT FK_UserEscola_Escola FOREIGN KEY (idEscola) REFERENCES tblEscola (idEscola)
);

CREATE TABLE tblAtividade (
    idAtividade SERIAL PRIMARY KEY,
    idUsuario INTEGER,
    nome VARCHAR(255),
    materia VARCHAR(100),
    eixo VARCHAR(100),
    modelo VARCHAR(255) UNIQUE,
    CONSTRAINT FK_Atividade_User FOREIGN KEY (idUsuario) REFERENCES tblUsuario (idUsuario)
);

CREATE TABLE tblSondagem (
    idSondagem SERIAL PRIMARY KEY,
    idUsuario INTEGER,
    idAluno INTEGER,
    materia VARCHAR(100),
    eixo VARCHAR(100),
    resultado VARCHAR(255),
    observacoes TEXT,
    imagemSondagem VARCHAR(255) UNIQUE,
    indDigital CHAR(1),
    idAtividade INTEGER,
    CONSTRAINT FK_Sondagem_User FOREIGN KEY (idUsuario) REFERENCES tblUsuario (idUsuario),
    CONSTRAINT FK_Sondagem_Aluno FOREIGN KEY (idAluno) REFERENCES tblAluno (idAluno),
    CONSTRAINT FK_Sondagem_Atividade FOREIGN KEY (idAtividade) REFERENCES tblAtividade (idAtividade)
);

CREATE TABLE tblLogUsuario (
    idLogUsuario SERIAL PRIMARY KEY,
    idUsuario INTEGER,
    idUsuarioModificado INTEGER,
    detalhes TEXT,
    dataAlteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_LogUser_Executor FOREIGN KEY (idUsuario) REFERENCES tblUsuario (idUsuario),
    CONSTRAINT FK_LogUser_Alvo FOREIGN KEY (idUsuarioModificado) REFERENCES tblUsuario (idUsuario)
);

CREATE TABLE tblLogSondagem (
    idLogSondagem SERIAL PRIMARY KEY,
    idSondagem INTEGER,
    idUsuario INTEGER,
    detalhes TEXT,
    dataAlteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_LogSond_Sondagem FOREIGN KEY (idSondagem) REFERENCES tblSondagem (idSondagem),
    CONSTRAINT FK_LogSond_User FOREIGN KEY (idUsuario) REFERENCES tblUsuario (idUsuario)
);

CREATE TABLE tblLogAluno (
    idLogAluno SERIAL PRIMARY KEY,
    idUsuario INTEGER,
    idAluno INTEGER,
    detalhes TEXT,
    dataAlteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_LogAluno_User FOREIGN KEY (idUsuario) REFERENCES tblUsuario (idUsuario),
    CONSTRAINT FK_LogAluno_Aluno FOREIGN KEY (idAluno) REFERENCES tblAluno (idAluno)
);

CREATE TABLE tblPermissoes (
    idPermissao SERIAL PRIMARY KEY,
    permissao VARCHAR(100),
    rolesPermitidas VARCHAR(255)
);

CREATE TABLE tblPermissaoUsuario (
    idPermissaoUsuario SERIAL PRIMARY KEY,
    idPermissao INTEGER,
    idUsuario INTEGER,
    CONSTRAINT FK_PermUser_Perm FOREIGN KEY (idPermissao) REFERENCES tblPermissoes (idPermissao),
    CONSTRAINT FK_PermUser_User FOREIGN KEY (idUsuario) REFERENCES tblUsuario (idUsuario)
);