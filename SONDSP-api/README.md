# SONDSP-api
SONDSP: Sondagem Educacional

## Fluxo de Desenvolvimento

### 1. Branches principais
- `main`: código estável, pronto para entrega.
- `dev`: onde todos desenvolvem juntos.

### 2. Como trabalhar
1. Sempre comece criando uma branch nova a partir de `dev`:
	- Para nova funcionalidade: `feature/nome-da-funcionalidade`
	- Para correção de bug: `fix/nome-do-bug`
2. Faça commits pequenos e frequentes, com mensagens claras.
3. Quando terminar, envie sua branch para o GitHub e abra um Pull Request para `dev`.
4. Alguém revisa (pode ser só conferir se está rodando e sem erro).
5. Após aprovação, faça o merge e delete a branch.

### 3. Convenção de commits
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `chore`: manutenção/configuração
- Exemplo: `feat: tela de login`

### 4. Dicas para evitar problemas
- Sempre atualize sua branch com `dev` antes de começar e antes de abrir o PR.
- Não suba arquivos grandes ou desnecessários (ex: pastas de build, `.expo`).
- Se tiver dúvida, pergunte antes de fazer merge.

