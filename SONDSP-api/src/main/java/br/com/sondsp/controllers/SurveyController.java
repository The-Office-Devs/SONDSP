package br.com.sondsp.controllers;

import br.com.sondsp.dtos.SurveyDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import br.com.sondsp.services.SurveyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/survey")
public class SurveyController {
    @Autowired
    private SurveyService surveyService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(description = "Cria uma nova sondagem.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Sondagem criada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SurveyDTO.class)
                    )
            )
    })
    public ResponseEntity<?> createSurvey(@ModelAttribute SurveyForm form) {
        return ResponseEntity.ok().body(new SurveyDTO(surveyService.createSurvey(form)));
    }

    @GetMapping()
    @Operation(
            description = "Retorna uma lista das Sondagens com base no filtro passado. Se nenhum filtro for passado, retorna todas as Sondagens.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Sondagens retornadas.",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = SurveyDTO.class))
                            )
                    )
            })
    public ResponseEntity<?> getActivities(@ModelAttribute SurveyFilter filter) {
        return ResponseEntity.ok().body(surveyService.listSurveys(filter).stream().map(SurveyDTO::new));
    }

    @PutMapping("/{id}")
    @Operation(description = "Atualiza a sondagem com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Sondagem atualizada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SurveyDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "SurveyDTO não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    public ResponseEntity<?> updateSurvey(@PathVariable Integer id, @RequestBody SurveyForm form) {
        return ResponseEntity.ok().body(new SurveyDTO(surveyService.updateSurvey(id, form)));
    }

    @DeleteMapping("/{id}")
    @Operation(description = "Desativa a Sondagem com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Sondagem desativada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SurveyDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Sondagem não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    public ResponseEntity<?> deleteSurvey(@PathVariable Integer id) {
        surveyService.deleteSurvey(id);
        return ResponseEntity.ok("Sondagem desativada com sucesso.");
    }
}
