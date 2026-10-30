package br.com.sondsp.controllers;

import br.com.sondsp.dtos.GroupedPermissionsDTO;
import br.com.sondsp.dtos.RoleDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.form.RoleForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Tag(name = "Funções e Permissões", description = "Gerenciamento de funções de acesso e catálogo de permissões por área")
public interface RolesController {

    @Operation(summary = "Lista todas as funções cadastradas", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Funções retornadas com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = RoleDTO.class))
                    )
            )
    })
    ResponseEntity<List<RoleDTO>> getAllRoles();

    @Operation(summary = "Retorna uma função pelo ID", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Função retornada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RoleDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Função não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<RoleDTO> getRoleById(@PathVariable Integer id);

    @Operation(summary = "Cadastra uma nova função com suas permissões", responses = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Função cadastrada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RoleDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Nome de função já cadastrado ou dados inválidos.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<RoleDTO> createRole(@Valid @RequestBody RoleForm form);

    @Operation(summary = "Atualiza uma função existente e suas permissões", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Função atualizada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RoleDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Tentativa de revogar permissões da função de Administrador ou dados inválidos.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Função não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<RoleDTO> updateRole(@PathVariable Integer id, @Valid @RequestBody RoleForm form);

    @Operation(summary = "Exclui uma função (exceto ADMIN ou funções em uso)", responses = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Função excluída com sucesso."
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "A função de Administrador não pode ser excluída ou possui usuários vinculados.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Função não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> deleteRole(@PathVariable Integer id);

    @Operation(summary = "Retorna todas as permissões do sistema agrupadas por área", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de permissões agrupadas por área retornada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = GroupedPermissionsDTO.class))
                    )
            )
    })
    ResponseEntity<List<GroupedPermissionsDTO>> getPermissionsGroupedByArea();
}
