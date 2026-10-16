package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SchoolClassAnnotationDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.filters.SchoolClassAnnotationFilter;
import br.com.sondsp.form.SchoolClassAnnotationForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.nio.file.AccessDeniedException;

public interface SchoolClassAnnotationController {

    @Operation(description = "Retorna uma anotação específica de uma turma com base no id da turma e no id da anotação.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Retorna a anotação informada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolClassAnnotationDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Anotação ou turma não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> getAnnotation(@PathVariable Integer schoolClassId, @PathVariable Integer id);

    @Operation(
            description = "Retorna todas as anotações paginadas de uma turma específica. É possível passar page, size e sort na URL.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Anotações retornadas com sucesso.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PageResponse.class)
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
    ResponseEntity<?> getAnnotations(
            @PathVariable Integer schoolClassId,
            @ModelAttribute SchoolClassAnnotationFilter filter,
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "creationDate", direction = Sort.Direction.DESC),
                    @SortDefault(sort = "id", direction = Sort.Direction.DESC)
            }) Pageable pageable
    );

    @Operation(description = "Cria uma nova anotação para a turma informada.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Anotação criada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolClassAnnotationDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados inválidos no formulário.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
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
    })
    ResponseEntity<?> createAnnotation(
            @PathVariable Integer schoolClassId,
            @RequestBody @Valid SchoolClassAnnotationForm form
    );

    @Operation(description = "Atualiza uma anotação existente (apenas pelo autor da anotação).", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Retorna a anotação atualizada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolClassAnnotationDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acesso negado (usuário logado não é o autor da anotação).",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Anotação ou turma não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> updateAnnotation(
            @PathVariable Integer schoolClassId,
            @PathVariable Integer id,
            @RequestBody @Valid SchoolClassAnnotationForm form
    ) throws AccessDeniedException;

    @Operation(description = "Exclui uma anotação com base no id da turma e id da anotação (apenas pelo autor).", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Anotação excluída com sucesso."
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acesso negado (usuário logado não é o autor da anotação).",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Anotação ou turma não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> deleteAnnotation(
            @PathVariable Integer schoolClassId,
            @PathVariable Integer id
    ) throws AccessDeniedException;
}