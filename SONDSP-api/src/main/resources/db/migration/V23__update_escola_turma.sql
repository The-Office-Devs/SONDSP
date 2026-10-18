ALTER TABLE escola ADD COLUMN codigo_interno VARCHAR(20);
ALTER TABLE turma  ADD COLUMN codigo_interno VARCHAR(20);

ALTER TABLE escola ADD CONSTRAINT uk_escola_codigo_interno UNIQUE (codigo_interno);
ALTER TABLE turma  ADD CONSTRAINT uk_turma_codigo_interno  UNIQUE (codigo_interno);