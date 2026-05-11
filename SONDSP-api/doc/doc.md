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