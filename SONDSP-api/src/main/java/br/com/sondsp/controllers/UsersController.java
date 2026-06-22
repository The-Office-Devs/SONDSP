package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.RegisterDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.dtos.UserDTO;
import br.com.sondsp.dtos.UsersListDTO;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.LinkSchoolClassForm;
import br.com.sondsp.form.LinkSchoolForm;
import br.com.sondsp.form.RegisterForm;
import br.com.sondsp.form.UserForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface UsersController {
    @Operation(description = "Registra um novo usuário", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário registrado com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RegisterDTO.class)
                    )
            )
    })
    ResponseEntity<?> register(RegisterForm form);

    @GetMapping("/{id}")
    @Operation(description = "Retorna o usuário com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário retornado com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            )
    })
    ResponseEntity<?> getUserById(Integer id);

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
    ResponseEntity<PageResponse<UsersListDTO>> listUser(UserFilter filter, Pageable pageable);

    @Operation(description = "Atualiza o usuário com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário atualizado com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuário não encontrado.",
                    content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> updateUser(Integer id, UserForm user);

    @Operation(description = "Vincula/desvincula um usuário a uma turma.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário vinculado/desvinculado a turma.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = String.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuário/turma não encontrado(a).",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> linkToSchoolClass(Integer id, LinkSchoolClassForm form);

    @Operation(description = "Vincula/desvincula um usuário a uma escola.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário vinculado/desvinculado a escola.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = String.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuário/escola não encontrado(a).",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> linkToSchool(Integer id, LinkSchoolForm form);

    @Operation(description = "Desativa ou ativa o usuário com o ID passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário desativado/ativado com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = String.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuário não encontrado.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> changeStatus(Integer id);
}
