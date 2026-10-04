# SONDSP — Sondagem Educacional em São Paulo

O **SONDSP** é um sistema de aplicação e gerenciamento de sondagens educacionais voltado para crianças do Ensino Fundamental I na cidade de São Paulo. O objetivo é auxiliar professores e profissionais da educação a acompanhar o desenvolvimento pedagógico dos alunos de forma ágil e centralizada.

## Tecnologias Principais
* **Back-end:** Java 21, Spring Boot, Spring Security, Flyway e PostgreSQL (localizado em [`SONDSP-api/`](./SONDSP-api/)).
* **Front-end:** React 19, TypeScript, Vite, Tailwind CSS e React Router (localizado em [`SONDSP-frontend/`](./SONDSP-frontend/)).

## Documentação

Cada parte do sistema possui uma documentação específica:

* [Documentação geral e fluxo de contribuição](./README.md)
* [Documentação do back-end](./SONDSP-api/doc/doc.md)
* [Documentação do front-end](./SONDSP-frontend/doc/doc.md)

## Execução local

### Back-end

Consulte [`SONDSP-api/doc/doc.md`](./SONDSP-api/doc/doc.md) para as configurações do Spring Boot, banco de dados, migrations e acesso ao Swagger.

### Front-end

```bash
cd SONDSP-frontend
npm install
cp .env.example .env
npm run dev
```

O endereço da API é configurado por `VITE_API_BASE_URL`. O valor utilizado no exemplo é `http://localhost:8081/api`.

## Desenvolvimento e fluxo de trabalho
Para garantir a qualidade das entregas e a organização do código, seguimos um padrão de versionamento e escrita de commits.

### Organização das branches
O repositório possui duas branches de integração contínua:
* `main`: Código funcional, estável e pronto para produção.
* `dev`: Ambiente de integração contínua; onde novas funcionalidades são testadas em conjunto.

### Como trabalhar
1. **Crie uma nova branch** a partir da `dev` utilizando os prefixos de acordo com a tarefa:
   * Nova funcionalidade: `feature/nome-da-funcionalidade`
   * Correção de bug: `fix/nome-do-bug`
   * Correções críticas em produção: `hotfix/nome-do-bug`
   * Refatoração de código: `refactor/nome-da-refatoracao`
2. **Faça commits pequenos e frequentes**, utilizando mensagens claras e o padrão *Conventional Commits*:
   * `feat: mensagem` — Nova funcionalidade.
   * `fix: mensagem` — Correção de erro.
   * `docs: mensagem` — Alteração exclusivamente em documentação.
   * `style: mensagem` — Mudanças de formatação/estilo que não alteram o comportamento do código.
   * `chore: mensagem` — Atualizações de build, pacotes, ou configurações de ferramentas.
3. Ao finalizar o desenvolvimento, **abra um Pull Request (PR)** apontando para a branch `dev`.
4. O código deverá ser revisado por pelo menos um par (desenvolvedor de front-end ou back-end).
5. Após a aprovação do PR, realize o **merge** com a branch `dev` e **delete a branch de trabalho local/remota** que você utilizou.

### Dicas para evitar problemas
* **Sempre atualize** sua branch local com a `dev` antes de iniciar o trabalho do dia e antes de abrir o seu Pull Request (`git pull origin dev`).
* **Atenção ao `.gitignore`:** Nunca envie arquivos pesados ou desnecessários para o repositório (ex: pastas de build, node_modules, `.expo`, ou variáveis de ambiente `.env`).
* **Comunicação em primeiro lugar:** Se tiver qualquer dúvida sobre conflitos de código ou arquitetura, consulte o time antes de realizar o merge.
