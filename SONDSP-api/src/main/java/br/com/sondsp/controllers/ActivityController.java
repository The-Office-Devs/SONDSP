package br.com.sondsp.controllers;

import br.com.sondsp.dtos.*;
import br.com.sondsp.filters.ActivityFilter;
import br.com.sondsp.form.ActivityForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface ActivityController {
	@Operation(
		description = "Registra uma nova atividade",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Atividade registrado com sucesso.",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = ActivityDTO.class))
			)
		}
	)
	ResponseEntity<?> registerActivity(ActivityForm form);

	@Operation(
		description = "Retorna a atividade com id passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Atividade retornada com sucesso.",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = ActivityDTO.class))
			)
		}
	)
	ResponseEntity<?> getActivityById(Integer id);

	@Operation(
		description = "Retorna uma lista das atividades de forma paginada com base no filtro passado. É possível passar page, size e sort na URL.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Retorna as atividades encontradas",
				content = @Content(
					mediaType = "application/json",
					array = @ArraySchema(schema = @Schema(implementation = ActivityDTO.class))
				)
			)
		}
	)
	ResponseEntity<PageResponse<ActivityDTO>> listActivities(ActivityFilter filter, Pageable pageable);

	@Operation(
		description = "Altera o status da atividade",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Atividade atualizada com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = ActivityDTO.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Atividade não encontrada.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> changeActivityStatus(Integer id);

	@Operation(
		description = "Recupera a imagem da atividade",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Imagem recuperada com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = ImageDTO.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Atividade não encontrada.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> getActivityImage(Integer id);
}
