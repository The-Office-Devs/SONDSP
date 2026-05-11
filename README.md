# SONDSP Sondagem Educacional em São Paulo.

O *SONDSP* é um sistema de aplicação e gerenciamento de sondagens educacionais voltado para crianças do Ensino Fundamental I na cidade de São Paulo. O objetivo do projeto é auxiliar professores e profissionais da educação a acompanhar o desenvolvimento pedagógico dos alunos de forma ágil e centralizada.

## Tecnologias Principais
* **Back-end:** Java / Spring Boot / PostgreSQL / Docker (localizado em `/SONDSP-api`)
* **Front-end:** React Native / Expo (localizado em `/SONDSP-frontend`)

## Desenvolvimento e fluxo de trabalho
Para garantir a qualidade das entregas e a organização do código, seguimos um padrão de versionamento e escrita de commits.

### Organização das Branchs
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

## Documentação do Projeto
O projeto SONDSP adota uma estrutura descentralizada de documentação. Cada parte do sistema possui suas especificidades documentadas em sua respectiva pasta `/doc`:

* **Back-end:** Toda a documentação de arquitetura, rotas e APIs do servidor está localizada no diretório [`/SONDSP-api/doc/`](./SONDSP-api/doc/).
* **Front-end:** Toda a documentação de interface, fluxos e componentes do aplicativo está localizada no diretório [`/SONDSP-frontend/doc/`](./SONDSP-frontend/doc/).
