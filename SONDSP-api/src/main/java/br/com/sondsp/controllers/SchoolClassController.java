package br.com.sondsp.controllers;

import br.com.sondsp.dtos.SchoolClassDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            description = "Retorna todas as turmas com base em um filtro. Caso o filtro não seja passado, retorna todas as turmas.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Turmas retornadas com sucesso.",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = SchoolClassForm.class))
                            )
                    )
            }
    )
    public ResponseEntity<?> getSchoolsClassesByFilter(@ModelAttribute SchoolClassFilter filter) {
        return ResponseEntity.ok().body(service.getSchoolsClasses(filter).stream().map(SchoolClassDTO::new));
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
