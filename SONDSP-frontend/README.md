# SONDSP-frontend
SONDSP: Sondagem Educacional

## Stack

| Tecnologia | Motivo |
|---|---|
| React 19 + TypeScript | Framework principal com tipagem estática |
| Vite | Build rápido e dev server com HMR |
| TailwindCSS 4 | Estilização utilitária — facilita manter layouts separados para desktop e mobile sem duplicar CSS |
| shadcn/ui | Componentes acessíveis e customizáveis (Button, Input, Card, etc.) |
| React Router | Roteamento SPA com rotas separadas por plataforma (`/desktop/*`, `/mobile/*`) |
| TanStack Query | Cache e gerenciamento de dados do servidor (evita refetch desnecessário) |
| Zustand | Estado global leve (autenticação, preferências) |
| React Hook Form + Zod | Formulários performáticos com validação tipada |
| Axios | Cliente HTTP com interceptors (JWT, auto-logout) |

## Decisões de Arquitetura

- **Desktop e Mobile são rotas unicas**, mas separados por componentes.
- **Lógica de negócio é compartilhada.** Hooks, services, schemas, stores e tipos são os mesmos para desktop e mobile. Só a camada visual muda.
- **TailwindCSS** foi escolhido justamente por facilitar essa separação: cada página monta seu layout com classes utilitárias sem precisar de um sistema CSS complexo.
- **Pastas organizadas por domínio**, não por tipo de arquivo. Tudo de `auth` fica junto em `src/auth/`, tudo de `turmas` ficará em `src/turmas/`, etc.
- **Sem componentização excessiva.** Componentes genéricos ficam em `components/ui/` (shadcn). Componentes específicos ficam dentro da feature.

## Estrutura de Pastas

```
src/
├── api/                  # Configuração do Axios (instância, interceptors)
│   └── axios.ts
├── auth/                 # Feature de autenticação
│   ├── auth.service.ts       # Chamadas à API
│   ├── auth.store.ts         # Estado global (Zustand)
│   ├── auth.types.ts         # Tipos e interfaces
│   ├── login.schema.ts       # Validação do formulário (Zod)
│   ├── use-login.ts          # Hook compartilhado (lógica)
│   ├── login-page.desktop.tsx  # Página visual desktop
│   └── login-page.mobile.tsx   # Página visual mobile
├── components/
│   └── ui/               # Componentes shadcn/ui (não editar manualmente)
├── layouts/
│   ├── desktop-layout.tsx    # Shell desktop (sidebar, topbar — futuro)
│   └── mobile-layout.tsx     # Shell mobile (bottom nav — futuro)
├── lib/
│   └── utils.ts          # Utilitário cn() do shadcn
├── routes/
│   └── router.tsx        # Definição de todas as rotas
├── App.tsx               # Root component + providers
├── index.css             # TailwindCSS + design tokens
└── main.tsx              # Entry point
```

**Para adicionar uma nova feature** (ex: turmas), crie `src/turmas/` seguindo o mesmo padrão do `auth/`.

## Como rodar

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Rodar em desenvolvimento
npm run dev
```

Requisitos: **Node 24** (LTS).

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
- Não suba arquivos grandes ou desnecessários (ex: pastas de build, `node_modules`).
- Se tiver dúvida, pergunte antes de fazer merge.