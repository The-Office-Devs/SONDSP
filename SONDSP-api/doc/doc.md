# Documentação da API
As especificações dos endpoints da API é feito via swagger de forma semi-automática, utilizando a biblioteca sipringdoc. A documentação da bibliioteca pode ser encontrada em: https://springdoc.org/ (acessado em 11/05/2026).

A biblioteca disponibiliza os seguintes acessos para os endpoints:
* servidor:porta/contexto/swagger-ui/index.html - visualização web do swagger
* servidor:porta/contexto/v3/api-docs - JSON com as informações no formato OpenAPI

## Utilização básica
Para utilizar a biblioteca da forma mais comum, as anotações a seguir são disponibilizadas:

### Operation
A anotação `Operation` permite passar as informações da operação realizada. Sua utilização básica:
@Operation(description = "Descrição do endpoint")

Utlização de exemplo:

`@Operation(description = "Retorna o aluno com base no ID")`

### ApiResponse(s)
Essa anotação na verdade é um conjunto de duas anotações, ApiResponse e ApiResponses, que definem o que cada resposta significa.
```
@ApiResponses(value = {
    @ApiResponse(responseCode = "[código]", description = "Mensagem da resposta"),
    @ApiResponse(responseCode = "[código]", description = "Mensagem da resposta")
})
```

Utlização de exemplo:
```
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Aluno retornado"),
    @ApiResponse(responseCode = "[código]", description = "Aluno com o id informado não encontrado")
})
```

# Banco de Dados
O banco de dados é versionado via migrations. A bilioteca responsável por fazer o gerenciamento das migrations é a "flyway". Para utilizar, é necessário criar o script da migration na pasta `./src/main/resources/db/migration/`.

O arquivo deve serguir a seguinte nomenclatura: "V[n]__mensagem.sql". Lembre-se de derrubar o servidor antes de criar o arquivo de migration, pois o flyway tentará aplicar ele toda vez que for salvo e o servidor estiver de pé.

## Nomenclatura de objetos
