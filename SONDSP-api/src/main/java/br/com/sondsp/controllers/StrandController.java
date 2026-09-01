package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StrandDTO;
import br.com.sondsp.form.StrandForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface StrandController {
    @Operation(description = "Cria um novo eixo.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Eixo criada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StrandDTO.class)
                    )
            )
    })
    ResponseEntity<?> createStrand(StrandForm form);

    @Operation(description = "Exclui um eixo.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Eixo excluído com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StrandDTO.class)
                    )
            )
    })
    ResponseEntity<?> deleteStrand(Integer idStrand);

    @Operation(description = "Lista todos os eixos ativos.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Retorna os eixos encontrados.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StrandDTO.class)
                    )
            )
    })
    ResponseEntity<?> getAllStrand();
}
