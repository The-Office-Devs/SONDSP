package br.com.sondsp.controllers;

import br.com.sondsp.dtos.*;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.xml.bind.ValidationException;
import java.io.IOException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface SurveyController {
	@Operation(
		description = "Cria uma nova sondagem.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Sondagem criada com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))
			)
		}
	)
	ResponseEntity<?> createSurvey(@RequestBody SurveyForm form) throws ValidationException, IOException;

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
		}
	)
	ResponseEntity<?> getSurveys(@ModelAttribute SurveyFilter filter);

	@Operation(
		description = "Retorna as Sondagens de um aluno de forma paginada, restritas ao aplicador autenticado, com base no filtro passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Sondagens retornadas com sucesso.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = PageResponse.class)
				)
			),
			@ApiResponse(
				responseCode = "401",
				description = "Usuário não autenticado.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			),
			@ApiResponse(
				responseCode = "404",
				description = "Aluno não encontrado.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<PageResponse<SurveyDTO>> getStudentSurveys(
		@PathVariable Integer id,
		@ModelAttribute SurveyFilter filter,
		@SortDefault.SortDefaults(
			{
				@SortDefault(sort = "status", direction = Sort.Direction.ASC),
				@SortDefault(sort = "activity.strand.subject", direction = Sort.Direction.ASC),
				@SortDefault(sort = "activity.name", direction = Sort.Direction.ASC, caseSensitive = false)
			}
		) Pageable pageable
	);

	@Operation(
		description = "Atualiza a sondagem com o id passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Sondagem atualizada com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = SurveyDTO.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Sondagem não encontrada.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> updateSurvey(@PathVariable Integer id, @ModelAttribute SurveyForm form) throws IOException;

	@Operation(
		description = "Desativa a Sondagem com o id passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Sondagem desativada com sucesso.",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = SurveyDTO.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Sondagem não encontrada.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> deleteSurvey(@PathVariable Integer id) throws ValidationException;

	@Operation(
		description = "Recupera a imagem da sondaggem",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Imagem recuperada com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = ImageDTO.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Sondagem não encontrada.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> getSurveyImage(@PathVariable Integer id);

	@Operation(
		description = "Retorna os níveis oficiais de avaliação permitidos para uma atividade com base em seu eixo e ano escolar segundo a SME-SP.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Opções de níveis retornadas com sucesso",
				content = @Content(
					mediaType = "application/json",
					array = @ArraySchema(schema = @Schema(implementation = br.com.sondsp.dtos.survey.SurveyResultOptionDTO.class))
				)
			)
		}
	)
	ResponseEntity<java.util.List<br.com.sondsp.dtos.survey.SurveyResultOptionDTO>> getActivityResultOptions(@PathVariable Integer activityId);

	@Operation(
		description = "Retorna os níveis oficiais de avaliação permitidos filtrando por nome do eixo e ano escolar.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Opções de níveis retornadas com sucesso",
				content = @Content(
					mediaType = "application/json",
					array = @ArraySchema(schema = @Schema(implementation = br.com.sondsp.dtos.survey.SurveyResultOptionDTO.class))
				)
			)
		}
	)
	ResponseEntity<java.util.List<br.com.sondsp.dtos.survey.SurveyResultOptionDTO>> getResultOptions(
		@RequestParam(required = false) String strandName,
		@RequestParam(required = false) String gradeLevel
	);
}
