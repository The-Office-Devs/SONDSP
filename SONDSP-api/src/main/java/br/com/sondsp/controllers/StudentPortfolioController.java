package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.dtos.portfolio.StudentAnnotationDTO;
import br.com.sondsp.dtos.portfolio.StudentPortfolioDTO;
import br.com.sondsp.dtos.portfolio.TimelineItemDTO;
import br.com.sondsp.entities.enums.AnnotationTag;
import br.com.sondsp.form.StudentAnnotationForm;
import br.com.sondsp.form.UpdateAnnotationTagsForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface StudentPortfolioController {

    @Operation(summary = "Retorna o portfólio cadastral e histórico do estudante", description = "Retorna os dados cadastrais do aluno, a turma atual e o histórico cronológico de matrículas.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Portfólio retornado com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StudentPortfolioDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Aluno não encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<StudentPortfolioDTO> getStudentPortfolio(Integer id);

    @Operation(summary = "Retorna a linha do tempo longitudinal de sondagens do estudante", description = "Retorna o histórico completo de sondagens finalizadas do aluno com evolução longitudinal neutra no mesmo eixo.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Timeline retornada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = TimelineItemDTO.class))
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Aluno não encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<List<TimelineItemDTO>> getStudentTimeline(Integer id, Integer strandId);

    @Operation(summary = "Retorna anotações paginadas do estudante", description = "Retorna a lista paginada de anotações registradas para o estudante com opção de filtro por tag.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Anotações retornadas com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PageResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Aluno não encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<PageResponse<StudentAnnotationDTO>> getStudentAnnotations(Integer id, AnnotationTag tag, Pageable pageable);

    @Operation(summary = "Registra uma nova anotação para o estudante", description = "Cria uma anotação vinculando o usuário autenticado atual como autor.", responses = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Anotação criada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StudentAnnotationDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Aluno não encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<StudentAnnotationDTO> createAnnotation(Integer id, StudentAnnotationForm form);

    @Operation(summary = "Atualiza texto e tags de uma anotação existente", description = "Permite a alteração do texto e das tags da anotação exclusivamente pelo autor original (HTTP 403 se for outro usuário).", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Anotação atualizada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StudentAnnotationDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Usuário atual não é o autor da anotação",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Anotação ou aluno não encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<StudentAnnotationDTO> updateAnnotation(Integer id, Integer annotationId, StudentAnnotationForm form);

    @Operation(summary = "Atualiza as tags de uma anotação", description = "Permite à equipe escolar alternar as tags da anotação para pautas de conselho/pedagógica.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Tags atualizadas com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StudentAnnotationDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Anotação ou aluno não encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<StudentAnnotationDTO> updateAnnotationTags(Integer id, Integer annotationId, UpdateAnnotationTagsForm form);

    @Operation(summary = "Exclui uma anotação do estudante", description = "Remove uma anotação existente exclusivamente pelo autor original (HTTP 403 se for outro usuário).", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Anotação excluída com sucesso"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Usuário atual não é o autor da anotação",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Anotação ou aluno não encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    ResponseEntity<?> deleteAnnotation(Integer id, Integer annotationId);
}
