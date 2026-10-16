package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SchoolClassDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

public interface SchoolClassController {
	@Operation(
		description = "Cria uma nova turma.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Turma criada com sucesso.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = SchoolClassDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> createSchoolClass(@Valid @RequestBody SchoolClassForm form);

	@Operation(
		description = "Busca a turma com base no id passado.",
		responses = {
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
		}
	)
	ResponseEntity<?> getSchoolClassById(@PathVariable Integer id);

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
	public ResponseEntity<PageResponse<SchoolClassDTO>> getSchoolsClassesByFilter(
		@ModelAttribute SchoolClassFilter filter,
		@SortDefault.SortDefaults(
			{
				@SortDefault(sort = "status", direction = Sort.Direction.DESC),
				@SortDefault(sort = "schoolYear", direction = Sort.Direction.DESC),
				@SortDefault(sort = "gradeLevel", direction = Sort.Direction.DESC),
				@SortDefault(sort = "name", direction = Sort.Direction.ASC, caseSensitive = false)
			}
		) Pageable pageable
	);

	@Operation(
		description = "Atualiza a turma com base no id.",
		responses = {
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
		}
	)
	ResponseEntity<?> updateSchoolClass(@PathVariable Integer id, @RequestBody SchoolClassForm form);

	@Operation(
		description = "Ativa/desativa a turma com base no id.",
		responses = {
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
		}
	)
	ResponseEntity<?> changeStatus(@PathVariable Integer id);

	public ResponseEntity<?> getStudentsPannel(
		@PathVariable Integer id,
		@RequestParam(required = false) String applicationPeriod,
		@RequestParam Integer strandId
	);

	@Operation(
			description = "Exporta o relatório das sondagens vinculadas a turma.",
			responses = {
					@ApiResponse(
							responseCode = "200",
							description = "Relatório exportado com sucesso.",
							content = @Content(
									mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
									schema = @Schema(type = "string", format = "binary")
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
			}
	)
	ResponseEntity<ByteArrayResource> exportSchoolClassSurveys(@PathVariable Integer schoolClassId) throws IOException;
}
