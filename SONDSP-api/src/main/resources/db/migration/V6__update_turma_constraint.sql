ALTER TABLE turma
DROP CONSTRAINT c_u_turma_escola_nome;

ALTER TABLE turma
ADD CONSTRAINT c_u_turma_escola_nome_ano
UNIQUE (id_escola, nome, ano_letivo);