# Documentação do front-end

O front-end do SONDSP é uma aplicação web responsiva para administradores, coordenadores, professores e POAs. O código é organizado por domínio em `src/`, com compartilhamento da lógica entre as apresentações desktop e mobile.

## Stack

| Tecnologia | Uso |
| --- | --- |
| React 19 + TypeScript | Interface e tipagem estática |
| Vite | Servidor de desenvolvimento, HMR e build |
| Tailwind CSS 4 | Estilização responsiva |
| React Router | Rotas da SPA e navegação protegida |
| TanStack Query | Cache e sincronização dos dados do servidor |
| Zustand | Estado global de autenticação |
| Axios | Comunicação HTTP com a API e interceptors |
| React Hook Form + Zod | Formulários e validação |
| shadcn/ui e Radix | Componentes de interface acessíveis |

## Funcionalidades implementadas

### Autenticação

Estão disponíveis as telas de login, ativação da conta, recuperação de senha e redefinição de senha. O token JWT é mantido no `localStorage` com a chave `sondsp-token`, validado na inicialização e enviado automaticamente nas requisições. Respostas `401` encerram a sessão.

O acesso é separado por áreas:

* **Administração:** administradores e administradores de escola;
* **Aplicação:** coordenadores, professores e POAs.

### Gerenciamento

A área administrativa possui telas para usuários, escolas, turmas, alunos, eixos e modelos de atividades. As telas têm versões desktop e mobile quando aplicável, formulários validados e operações de listagem, filtros, paginação, criação, edição e inativação conforme o domínio.

### Aplicação de sondagens

A área de aplicação possui:

* seleção e consulta de turmas;
* abertura de sondagem para um aluno;
* seleção de atividade/eixo;
* registro de resultado e observações;
* envio opcional de imagem;
* histórico de sondagens por aluno;
* visualização e exclusão de sondagens.

## Rotas

Rotas públicas:

| Rota | Tela |
| --- | --- |
| `/login` | Login |
| `/ativar-conta` | Ativação de conta |
| `/esqueci-senha` | Recuperação de senha |
| `/redefinir-senha` | Redefinição de senha |

Rotas protegidas:

| Rota | Área |
| --- | --- |
| `/gerenciamento/usuarios` | Usuários |
| `/gerenciamento/escolas` | Escolas |
| `/gerenciamento/turmas` | Turmas |
| `/gerenciamento/alunos` | Alunos |
| `/gerenciamento/eixos` | Eixos |
| `/gerenciamento/modelos-atividades` | Modelos de atividades |
| `/app-turmas` | Seleção de turmas |
| `/app-sondagens` | Sondagens |
| `/app-sondagens/historico/aluno/:id` | Histórico do aluno |

O redirecionamento inicial depende do perfil: usuários administrativos vão para o gerenciamento de usuários; usuários da aplicação vão para a seleção de turmas.

## Organização do código

```text
src/
├── api/                  # Instância Axios e tipos de paginação
├── auth/                 # Login, conta, senha, store e autorização
├── activities/           # Modelos de atividades
├── classes/              # Turmas e filtro de turmas
├── schools/              # Escolas
├── strands/              # Eixos
├── students/             # Alunos
├── surveys/              # Sondagens e histórico
├── users/                # Usuários
├── components/           # Componentes compartilhados e UI
├── contexts/             # Contexto do shell da aplicação
├── hooks/                # Hooks reutilizáveis
├── layouts/              # Layout autenticado
├── lib/                  # Utilitários
└── routes/               # Rotas e guards
```

Cada domínio deve concentrar seus `types`, `service`, `schema`, hooks e páginas. Componentes específicos ficam dentro do domínio; componentes genéricos ficam em `components/`.

## Configuração e execução

Requer **Node 24 (LTS)**.

```bash
npm install
cp .env.example .env
npm run dev
```

Configure no `.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:8081/api
```

Comandos disponíveis:

```bash
npm run dev       # desenvolvimento com HMR
npm run build     # type-check e build de produção
npm run lint      # ESLint
npm run preview   # pré-visualização do build
```

O back-end e seu contrato OpenAPI estão documentados em [`../../SONDSP-api/doc/doc.md`](../../SONDSP-api/doc/doc.md).
