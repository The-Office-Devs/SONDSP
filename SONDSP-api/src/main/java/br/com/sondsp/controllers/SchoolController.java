package br.com.sondsp.controllers;

import br.com.sondsp.dtos.SchoolDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.filters.SchoolFilter;
import br.com.sondsp.form.SchoolForm;
import br.com.sondsp.services.SchoolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
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
    public ResponseEntity<?> createSchool(@RequestBody SchoolForm form) {
        return ResponseEntity.status(HttpStatus.OK).body(new SchoolDTO(service.createSchool(form)));
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
        return ResponseEntity.status(HttpStatus.OK).body(new SchoolDTO(service.getSchool(id)));
    }

    @GetMapping()
    @Operation(description = "Lista todas as escolas com base em um filtro passado. Caso o filtro não seja passado, irá retornar todas as escolas.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Todas as escolas retornadas.",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = SchoolDTO.class))
                    )
            )
    })
    public ResponseEntity<?> getSchoolsByfilter(@RequestBody SchoolFilter filter) {
        return ResponseEntity.status(HttpStatus.OK).body(service.getSchools(filter).stream().map(SchoolDTO::new));
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
    public ResponseEntity<?> updateSchool(@PathVariable Integer id, @RequestBody SchoolForm form) {
        return ResponseEntity.status(HttpStatus.OK).body(new SchoolDTO(service.updateSchool(id, form)));
    }
}
