package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.dtos.UserDTO;
import br.com.sondsp.dtos.UsersListDTO;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.RegisterForm;
import br.com.sondsp.form.UserForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface UsersController {
    @Operation(description = "Registra um novo usuário", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário registrado com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            )
    })
    ResponseEntity<?> register(@Valid @RequestBody RegisterForm form);

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
    ResponseEntity<?> getUserById(@PathVariable Integer id);

    @Operation(
            description = "Retorna todos os usuários com base no filtro passado. Se nenhum filtro for passado, retorna todos os usuários.",
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
    ResponseEntity<?> listUser(@ModelAttribute UserFilter filter);

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
    ResponseEntity<?> updateUser(@PathVariable Integer id, @Valid @RequestBody UserForm user);

    @Operation(description = "Desativa o usuário com o ID passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário desativado com sucesso",
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
    ResponseEntity<?> deleteUser(@PathVariable Integer id);
}
