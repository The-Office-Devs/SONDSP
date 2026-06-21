package br.com.sondsp.controllers;

import br.com.sondsp.dtos.ActivityDTO;
import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.ActivityFilter;
import br.com.sondsp.form.ActivityForm;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/activity")
public class ActivityController {
    @Autowired
    private ActivityService activityService;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping()
    @Operation(description = "Cria uma nova atividade.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Atividade criada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ActivityDTO.class)
                    )
            )
    })
    public ResponseEntity<?> createActivity(@RequestBody ActivityForm form) {
        Optional<User> creator = authenticationService.getCurrentUser();
        if (creator.isPresent()) {
            return ResponseEntity.ok().body(new ActivityDTO(activityService.createActivity(form, creator.get())));

        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Error Recovering User");
        }
    }

    @GetMapping()
    @Operation(
            description = "Retorna uma lista das Atividades com base no filtro passado. Se nenhum filtro for passado, retorna todas as Atividades.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Atividades retornadas.",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ActivityDTO.class))
                            )
                    )
            })
    public ResponseEntity<?> getActivities(@ModelAttribute ActivityFilter filter) {
        return ResponseEntity.ok().body(activityService.listActivities(filter).stream().map(ActivityDTO::new));
    }

    @PutMapping("/{id}")
    @Operation(description = "Atualiza a atividade com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Atividade atualizada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ActivityDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "ActivityDTO não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    public ResponseEntity<?> updateActivity(@PathVariable Integer id, @RequestBody ActivityForm form) {
        return ResponseEntity.ok().body(new ActivityDTO(activityService.updateActivity(id, form)));
    }

    @DeleteMapping("/{id}")
    @Operation(description = "Desativa a Atividade com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Atividade desativada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ActivityDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Atividade não encontrada.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    public ResponseEntity<?> deleteActivity(@PathVariable Integer id) {
        activityService.deleteActivity(id);
        return ResponseEntity.ok("Atividade desativada com sucesso.");
    }
}
