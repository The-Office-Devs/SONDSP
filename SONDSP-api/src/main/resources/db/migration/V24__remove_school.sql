-- Remove escolas
ALTER TABLE turma
DROP  COLUMN id_escola;

DROP TABLE usuario_x_escola;
DROP TABLE escola;
