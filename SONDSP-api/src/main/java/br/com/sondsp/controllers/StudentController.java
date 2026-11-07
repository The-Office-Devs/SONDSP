package br.com.sondsp.controllers;

import br.com.sondsp.dtos.*;
import br.com.sondsp.filters.StudentFilter;
import br.com.sondsp.form.StudentForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

public interface StudentController {
	@Operation(
		description = "Cria um novo aluno.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Aluno criado com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))
			)
		}
	)
	ResponseEntity<?> createStudent(@RequestBody @Valid StudentForm form);

	@Operation(
		description = "Cria alunos com base em um array.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Aluno criado com sucesso",
				content = @Content(
					mediaType = "application/json",
					array = @ArraySchema(schema = @Schema(implementation = StudentDTO.class))
				)
			)
		}
	)
	ResponseEntity<?> createStudents(@RequestBody @Valid List<StudentForm> forms);

	@Operation(
		description = "Retorna o aluno com o id passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Aluno retornado com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))
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
	ResponseEntity<?> getStudent(@PathVariable Integer id);

	@Operation(
		description = "Retorna uma lista dos alunos de forma paginada com base no filtro passado. É possível passar page, size e sort na URL.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Alunos retornados com sucesso.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = PageResponse.class)
				)
			)
		}
	)
	ResponseEntity<PageResponse<StudentDTO>> getStudents(
		@ModelAttribute StudentFilter filter,
		@SortDefault.SortDefaults(
			{
				@SortDefault(sort = "status", direction = Sort.Direction.DESC),
				@SortDefault(sort = "rowNumber", direction = Sort.Direction.ASC),
				@SortDefault(sort = "name", direction = Sort.Direction.ASC, caseSensitive = false)
			}
		) Pageable pageable
	);

	@Operation(
		description = "Atualiza o aluno com o id passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Aluno atualizado com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))
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
	ResponseEntity<?> updateStudent(@PathVariable Integer id, @Valid @RequestBody StudentForm form);

	@Operation(
		description = "Desativa/ativa o aluno com o id passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Aluno desativado/ativado com sucesso.",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))
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
	ResponseEntity<?> changeStatus(@PathVariable Integer id);

	@Operation(
		description = "Importa em lote os alunos de uma turma a partir de uma planilha Excel (.xlsx ou .xls). " +
		"Localiza a escola pelo código interno, cria a turma caso não exista, desvincula da turma os alunos " +
		"que não estão na planilha e cria ou atualiza os demais pela matrícula, vinculando-os à turma.",
		requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
			content = @Content(
				mediaType = "multipart/form-data",
				schema = @Schema(type = "object"),
				schemaProperties = @SchemaProperty(
					name = "file",
					schema = @Schema(
						type = "string",
						format = "binary",
						description = "Planilha Excel com a lista de alunos da turma."
					)
				)
			)
		),
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Alunos importados com sucesso. Retorna o resumo da importação.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StudentImportResultDTO.class)
				)
			),
			@ApiResponse(
				responseCode = "400",
				description = "Arquivo inválido, cabeçalho ausente, erros nas linhas da planilha, escola ou turma inativa.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			),
			@ApiResponse(
				responseCode = "404",
				description = "Escola não encontrada para o código interno informado.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> importStudents(@RequestParam("file") MultipartFile file);
}
