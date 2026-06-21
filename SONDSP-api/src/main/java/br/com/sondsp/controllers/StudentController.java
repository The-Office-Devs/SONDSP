package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.dtos.StudentDTO;
import br.com.sondsp.entities.Student;
import br.com.sondsp.filters.StudentFilter;
import br.com.sondsp.form.StudentForm;
import br.com.sondsp.services.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {
    @Autowired
    private StudentService service;

    @PostMapping()
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
    public ResponseEntity<?> createStudent(@RequestBody StudentForm form) {
        return ResponseEntity.ok().body(new StudentDTO(service.createStudent(form)));
    }

    @PostMapping("/load")
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
    public ResponseEntity<?> createStudents(@RequestBody List<StudentForm> forms) {
        return ResponseEntity.ok().body(service.createStudents(forms).stream().map(StudentDTO::new));
    }

    @GetMapping("/{id}")
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
    public ResponseEntity<?> getStudent(@RequestParam Integer id) {
        return ResponseEntity.ok().body(new StudentDTO(service.getStudent(id)));
    }

    @GetMapping()
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
    public ResponseEntity<PageResponse<StudentDTO>> getStudents(
            @ModelAttribute StudentFilter filter,
            @PageableDefault(size = 5) Pageable pageable) {

        Page<Student> studentPage = service.getStudents(filter, pageable);

        List<StudentDTO> contentDTO = studentPage.getContent().stream()
                .map(StudentDTO::new)
                .toList();

        PageResponse<StudentDTO> response = new PageResponse<>(
                contentDTO,
                studentPage.getNumber(),
                studentPage.getSize(),
                studentPage.getTotalElements(),
                studentPage.getTotalPages(),
                studentPage.hasNext(),
                studentPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
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
    public ResponseEntity<?> updateStudent(@RequestParam Integer id, @RequestBody StudentForm form) {
        return ResponseEntity.ok().body(new StudentDTO(service.updateStudent(id, form)));
    }

    @DeleteMapping("/{id}")
    @Operation(description = "Desativa o aluno com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Aluno desativado com sucesso.",
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
    public ResponseEntity<?> deleteStudent(@RequestParam Integer id) {
        service.deleteStudent(id);
        return ResponseEntity.ok("Aluno desativado com sucesso.");
    }
}
