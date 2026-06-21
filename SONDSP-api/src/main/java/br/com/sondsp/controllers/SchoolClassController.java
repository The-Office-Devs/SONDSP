package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SchoolClassDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import br.com.sondsp.services.SchoolClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/schoolClass")
public class SchoolClassController {
    @Autowired
    private SchoolClassService service;

    @PostMapping()
    @Operation(description = "Cria uma nova turma.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Turma criada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolClassDTO.class)
                    )
            )
    })
    public ResponseEntity<?> createSchoolClass(@Valid @RequestBody SchoolClassForm form) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.createSchoolClass(form)));
    }

    @GetMapping("/{id}")
    @Operation(description = "Busca a turma com base no id passado.", responses = {
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
    })
    public ResponseEntity<?> getSchoolClassById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.getSchoolClass(id)));
    }

    @GetMapping()
    @Operation(
            description = "Retorna as turmas paginadas com base em um filtro. É possível passar page, size e sort na URL.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Turmas retornadas com sucesso.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PageResponse.class)
                            )
                    )
            }
    )
    public ResponseEntity<PageResponse<SchoolClassDTO>> getSchoolsClassesByFilter(
            @ModelAttribute SchoolClassFilter filter,
            @PageableDefault(size = 5) Pageable pageable) {

        Page<SchoolClass> schoolClassPage = service.getSchoolsClasses(filter, pageable);

        List<SchoolClassDTO> contentDTO = schoolClassPage.getContent().stream()
                .map(SchoolClassDTO::new)
                .toList();

        PageResponse<SchoolClassDTO> response = new PageResponse<>(
                contentDTO,
                schoolClassPage.getNumber(),
                schoolClassPage.getSize(),
                schoolClassPage.getTotalElements(),
                schoolClassPage.getTotalPages(),
                schoolClassPage.hasNext(),
                schoolClassPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
    @Operation(description = "Atualiza a turma com base no id.", responses = {
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
    })
    public ResponseEntity<?> updateSchoolClass(@PathVariable Integer id, @RequestBody SchoolClassForm form) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.updateSchoolClass(id, form)));
    }

    @DeleteMapping("/{id}")
    @Operation(description = "Remove a turma com base no id.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Turma removida com sucesso.",
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
    })
    public ResponseEntity<?> deleteSchoolClass(@PathVariable Integer id) {
        service.deleteSchoolClass(id);
        return ResponseEntity.ok("Turma desativada com sucesso.");
    }
}
