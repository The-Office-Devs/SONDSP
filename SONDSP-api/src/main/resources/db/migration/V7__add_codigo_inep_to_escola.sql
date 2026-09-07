ALTER TABLE escola
ADD COLUMN codigo_inep VARCHAR(8) NOT NULL,
ADD CONSTRAINT c_u_escola_codigo_inep UNIQUE (codigo_inep);
