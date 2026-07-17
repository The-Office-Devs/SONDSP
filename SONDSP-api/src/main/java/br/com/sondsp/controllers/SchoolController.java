package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SchoolDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.filters.SchoolFilter;
import br.com.sondsp.form.SchoolForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface SchoolController {
    @Operation(description = "Cria uma nova escola.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Escola criada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolDTO.class)
                    )
            )
    })
    ResponseEntity<?> createSchool(SchoolForm form);

    @Operation(description = "Retorna escola com base no id.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Retorna a escola com o id informado.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Escola não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> getSchoolById(Integer id);

    @Operation(
            description = "Retorna as escolas paginadas com base em um filtro. É possível passar page, size e sort na URL.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Todas as escolas retornadas com sucesso.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PageResponse.class)
                            )
                    )
            }
    )
    public ResponseEntity<PageResponse<SchoolDTO>> getSchoolsByfilter(SchoolFilter filter, Pageable pageable);

    @Operation(description = "Atualiza uma escola com base no id.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Retorna a escola atualizada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Escola não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> updateSchool(Integer id, SchoolForm form);

    @Operation(description = "Desativa/ativa a escola com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Escola desativada/ativada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Escola não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> changeStatus(Integer id);
}
