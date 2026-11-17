INSERT INTO permissao (permissao, descricao, area)
VALUES ('SONDAGEM_DIGITAL_MANAGE', 'Criação e execução de sondagens digitais', 'Sondagens');

INSERT INTO funcao_x_permissao (id_funcao, id_permissao)
SELECT 1,
       p.id
FROM permissao p
WHERE p.permissao = 'SONDAGEM_DIGITAL_MANAGE';

ALTER TABLE sondagem
ADD COLUMN resposta TEXT,
ADD COLUMN ind_fechada BOOLEAN;