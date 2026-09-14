ALTER TABLE public.atividade DROP COLUMN materia;
ALTER TABLE public.atividade DROP COLUMN eixo;

ALTER TABLE public.atividade RENAME COLUMN modelo TO imagem_ref;
ALTER TABLE public.atividade RENAME COLUMN status TO ativo;

ALTER TABLE public.atividade ADD COLUMN id_eixo INTEGER NOT NULL;
ALTER TABLE public.atividade ADD COLUMN ano_escolar varchar(50) NOT NULL;
ALTER TABLE public.atividade ADD COLUMN bimestre varchar(50) NOT NULL;

ALTER TABLE public.atividade ADD CONSTRAINT c_fk_atividade_eixo FOREIGN KEY (id_eixo) REFERENCES public.eixo(id);