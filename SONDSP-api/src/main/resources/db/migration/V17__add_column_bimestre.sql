ALTER TABLE sondagem
    ADD COLUMN bimestre_aplicacao varchar(50);

UPDATE sondagem s
SET bimestre_aplicacao = (SELECT a.bimestre
                          FROM atividade a
                          WHERE a.id = s.id_atividade);

ALTER TABLE sondagem
    ALTER COLUMN bimestre_aplicacao SET NOT NULL;