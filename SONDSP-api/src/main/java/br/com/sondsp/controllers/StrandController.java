package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StrandDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

public interface StrandController {
	@Operation(
		description = "Busca um eixo pelo ID.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Retorna o eixo encontrado.",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = StrandDTO.class))
			)
		}
	)
	ResponseEntity<StrandDTO> getStrand(@PathVariable Integer id);

	@Operation(
		description = "Lista todos os eixos ativos por matéria.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Retorna os eixos encontrados.",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = StrandDTO.class))
			)
		}
	)
	ResponseEntity<java.util.List<StrandDTO>> findBySubject(@RequestParam String subject);
}
