package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.dtos.StudentDTO;
import br.com.sondsp.dtos.SurveyDTO;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface SurveyController {
    @Operation(description = "Cria uma nova sondagem.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Sondagem criada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StudentDTO.class)
                    )
            )
    })
    ResponseEntity<?> createSurvey(SurveyForm form);

    @Operation(
            description = "Retorna uma lista das Sondagens com base no filtro passado. Se nenhum filtro for passado, retorna todas as Sondagens.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Sondagens retornadas.",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = SurveyDTO.class))
                            )
                    )
            })
    ResponseEntity<?> getActivities(SurveyFilter filter);

    @Operation(description = "Atualiza a sondagem com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Sondagem atualizada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SurveyDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Sondagem não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> updateSurvey(Integer id, SurveyForm form);

    @Operation(description = "Desativa a Sondagem com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Sondagem desativada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SurveyDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Sondagem não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> deleteSurvey(Integer id);
}
