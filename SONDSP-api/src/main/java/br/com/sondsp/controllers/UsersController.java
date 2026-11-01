package br.com.sondsp.controllers;

import br.com.sondsp.dtos.*;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.LinkSchoolClassForm;
import br.com.sondsp.form.UserForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface UsersController {
	@Operation(
		description = "Registra um novo usuário",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Usuário registrado com sucesso.",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = RegisterDTO.class))
			)
		}
	)
	ResponseEntity<?> register(@Valid @RequestBody UserForm form);

	@GetMapping("/{id}")
	@Operation(
		description = "Retorna o usuário com o id passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Usuário retornado com sucesso.",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class))
			)
		}
	)
	ResponseEntity<?> getUserById(@PathVariable Integer id);

	@Operation(
		description = "Retorna uma lista dos alunos de forma paginada com base no filtro passado. É possível passar page, size e sort na URL.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Retorna os usuários encontrados",
				content = @Content(
					mediaType = "application/json",
					array = @ArraySchema(schema = @Schema(implementation = UsersListDTO.class))
				)
			)
		}
	)
	ResponseEntity<PageResponse<UsersListDTO>> listUser(
		@ModelAttribute UserFilter filter,
		@PageableDefault(size = 5) @SortDefault.SortDefaults(
			{
				@SortDefault(sort = "status", direction = Sort.Direction.DESC),
				@SortDefault(sort = "name", direction = Sort.Direction.ASC, caseSensitive = false)
			}
		) Pageable pageable
	);

	@Operation(
		description = "Atualiza o usuário com o id passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Usuário atualizado com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Usuário não encontrado.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> updateUser(@PathVariable Integer id, @Valid @RequestBody UserForm user);

	@Operation(
		description = "Vincula/desvincula um usuário a uma turma.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Usuário vinculado/desvinculado a turma.",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Usuário/turma não encontrado(a).",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> linkToSchoolClass(@PathVariable Integer id, @Valid @RequestBody LinkSchoolClassForm form);

	@Operation(
		description = "Desativa ou ativa o usuário com o ID passado.",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Usuário desativado/ativado com sucesso",
				content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Usuário não encontrado.",
				content = @Content(
					mediaType = "application/json",
					schema = @Schema(implementation = StandardErrorDTO.class)
				)
			)
		}
	)
	ResponseEntity<?> changeStatus(@PathVariable Integer id);
}
