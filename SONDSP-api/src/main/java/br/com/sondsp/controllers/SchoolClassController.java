package br.com.sondsp.controllers;

import br.com.sondsp.dtos.SchoolClassDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface SchoolClassController {
    @Operation(description = "Cria uma nova turma.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Turma criada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolClassDTO.class)
                    )
            )
    })
    ResponseEntity<?> createSchoolClass(SchoolClassForm form);

    @Operation(description = "Busca a turma com base no id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Turma retornada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolClassDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Turma não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> getSchoolClassById(Integer id);

    @Operation(
            description = "Retorna todas as turmas com base em um filtro. Caso o filtro não seja passado, retorna todas as turmas.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Turmas retornadas com sucesso.",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = SchoolClassForm.class))
                            )
                    )
            }
    )
    ResponseEntity<?> getSchoolsClassesByFilter(SchoolClassFilter filter);

    @Operation(description = "Atualiza a turma com base no id.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Turma atualizada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolClassDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Turma não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> updateSchoolClass(Integer id, SchoolClassForm form);

    @Operation(description = "Ativa/desativa a turma com base no id.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Turma ativada/desativada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolClassDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Turma não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> changeStatus(Integer id);
}
