package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.dtos.StudentDTO;
import br.com.sondsp.filters.StudentFilter;
import br.com.sondsp.form.StudentForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface StudentController {
    @Operation(description = "Cria um novo aluno.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Aluno criado com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StudentDTO.class)
                    )
            )
    })
    ResponseEntity<?> createStudent(StudentForm form);

    @Operation(description = "Cria alunos com base em um array.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Aluno criado com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = StudentDTO.class))
                    )
            )
    })
    ResponseEntity<?> createStudents(List<StudentForm> forms);

    @Operation(description = "Retorna o aluno com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Aluno retornado com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StudentDTO.class)
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
    })
    ResponseEntity<?> getStudent(Integer id);

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
    })
    ResponseEntity<PageResponse<StudentDTO>> getStudents(StudentFilter filter, Pageable pageable);

    @Operation(description = "Atualiza o aluno com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Aluno atualizado com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StudentDTO.class)
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
    })
    ResponseEntity<?> updateStudent(Integer id, StudentForm form);

    @Operation(description = "Desativa/ativa o aluno com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Aluno desativado/ativado com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StudentDTO.class)
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
    })
    ResponseEntity<?> changeStatus(Integer id);
}
