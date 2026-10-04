# Documentação do back-end e da API

O back-end é uma aplicação Spring Boot executada na porta `8081`, com PostgreSQL como banco de dados e Flyway para versionamento do schema.

## Configuração e execução local

Requer **Java 21**. As dependências são gerenciadas pelo Gradle Wrapper, portanto não é necessário instalar o Gradle separadamente.

```bash
cd SONDSP-api
cp .env.example .env
./gradlew bootRun
```

Antes de iniciar a aplicação, preencha no arquivo `.env` as variáveis necessárias para o banco de dados, JWT e, quando aplicável, o servidor SMTP. A aplicação carrega automaticamente esse arquivo durante o `bootRun`. As principais variáveis são:

* `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` — conexão com o PostgreSQL;
* `JWT_SECRET` — chave usada para assinar os tokens;
* `PORT` — porta da aplicação, com valor padrão `8081`;
* `FRONTEND_URL` — endereço do front-end para as configurações de integração;
* `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` e `MAIL_FROM` — envio de e-mails de recuperação e ativação de conta.

Comandos úteis:

```bash
./gradlew test       # executa os testes
./gradlew build      # compila e gera o artefato da aplicação
./gradlew bootRun    # inicia o servidor em desenvolvimento
```

Com o servidor em execução, a API fica disponível em `http://localhost:8081`. As migrations do Flyway são aplicadas automaticamente na inicialização.

## Swagger / OpenAPI

As especificações dos endpoints são geradas de forma semi-automática pela biblioteca Springdoc. A documentação da biblioteca está disponível em [springdoc.org](https://springdoc.org/).

A biblioteca disponibiliza os seguintes acessos:

* `servidor:porta/contexto/swagger-ui/index.html` — visualização web do Swagger;
* `servidor:porta/contexto/v3/api-docs` — JSON com as informações no formato OpenAPI.

A aplicação possui, entre outras, as áreas de autenticação (`/auth`) e usuários (`/api/users`). O contrato publicado pelo Swagger deve ser considerado a fonte de verdade para os endpoints disponíveis em cada versão.

## Utilização básica

### `Operation`

A anotação `Operation` permite descrever a operação realizada:

```java
@Operation(description = "Retorna o aluno com base no ID")
```

### `ApiResponse(s)`

As anotações `ApiResponse` e `ApiResponses` documentam as respostas possíveis:

```java
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Aluno retornado"),
    @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
})
```

## Banco de dados

O banco de dados é versionado via migrations. A biblioteca responsável pelo gerenciamento é o Flyway. Para criar uma alteração, adicione um script em `./src/main/resources/db/migration/`.

O arquivo deve seguir a nomenclatura `V[n]__mensagem.sql`. Pare o servidor antes de criar ou alterar uma migration; o Flyway pode tentar aplicá-la assim que a aplicação for iniciada.

## Nomenclatura de objetos

O banco de dados possui regras de nomenclatura para facilitar a busca dos dados e manter a conformidade:

* tabelas usam o nome da entidade, por exemplo `aluno`;
* tabelas de relacionamento usam o nome de ambas as entidades separado por `x`, por exemplo `aluno_x_turma`;
* todos os objetos usam `snake_case`, por exemplo `id_aluno`;
* nomes de atributos não referenciam a própria tabela. Na tabela `aluno`, o identificador é `id`; FKs para `aluno.id` usam `id_aluno`;
* outros objetos indicam seu tipo no nome:
  * sequences: `tabela_atributo_seq`, por exemplo `aluno_id_seq`;
  * constraints: `c_tipo_tabela`, por exemplo `c_pk_aluno`;
  * triggers: `t_nome`, por exemplo `t_log_aluno`.

O fluxo de contribuição do repositório está documentado no [README da raiz](../../README.md).
