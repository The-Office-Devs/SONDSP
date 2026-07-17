package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SchoolDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.entities.School;
import br.com.sondsp.filters.SchoolFilter;
import br.com.sondsp.form.SchoolForm;
import br.com.sondsp.services.SchoolService;
import io.swagger.v3.oas.annotations.Operation;
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

@RestController
@RequestMapping("/school")
public class SchoolController {
    @Autowired
    private SchoolService service;

    @PostMapping()
    @Operation(description = "Cria uma nova escola.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Escola criada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolDTO.class)
                    )
            )
    })
    public ResponseEntity<?> createSchool(@Valid @RequestBody SchoolForm form) {
        return ResponseEntity.ok().body(new SchoolDTO(service.createSchool(form)));
    }

    @GetMapping("/{id}")
    @Operation(description = "Retorna escola com base no id.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Retorna a escola com o id informado.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Escola não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    public ResponseEntity<?> getSchoolById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(new SchoolDTO(service.getSchool(id)));
    }

    @GetMapping()
    @Operation(
            description = "Lista as escolas de forma paginada com base em um filtro. É possível passar page, size e sort na URL.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Todas as escolas retornadas com sucesso.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PageResponse.class)
                            )
                    )
            })
    public ResponseEntity<PageResponse<SchoolDTO>> getSchoolsByfilter(
            @ModelAttribute SchoolFilter filter,
            @PageableDefault(size = 5) Pageable pageable) {

        Page<School> schoolPage = service.getSchools(filter, pageable);

        List<SchoolDTO> contentDTO = schoolPage.getContent().stream()
                .map(SchoolDTO::new)
                .toList();

        PageResponse<SchoolDTO> response = new PageResponse<>(
                contentDTO,
                schoolPage.getNumber(),
                schoolPage.getSize(),
                schoolPage.getTotalElements(),
                schoolPage.getTotalPages(),
                schoolPage.hasNext(),
                schoolPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
    @Operation(description = "Atualiza uma escola com base no id.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Retorna a escola atualizada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Escola não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    public ResponseEntity<?> updateSchool(@PathVariable Integer id, @Valid @RequestBody SchoolForm form) {
        return ResponseEntity.ok().body(new SchoolDTO(service.updateSchool(id, form)));
    }

    @DeleteMapping("/{id}")
    @Operation(description = "Desativa a escola com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Escola removida com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SchoolDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Escola não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    public ResponseEntity<?> deleteSchool(@PathVariable Integer id) {
        service.deleteSchool(id);
        return ResponseEntity.ok("Escola removida com sucesso.");
    }
}
