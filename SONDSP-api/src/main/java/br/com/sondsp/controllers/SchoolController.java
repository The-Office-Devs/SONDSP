package br.com.sondsp.controllers;

import br.com.sondsp.dtos.SchoolDTO;
import br.com.sondsp.form.SchoolForm;
import br.com.sondsp.services.SchoolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/school")
public class SchoolController {
    @Autowired
    private SchoolService schoolService;

    @PostMapping()
    @Operation(description = "", responses = {
        @ApiResponse(responseCode = "200", description = "Escola criada com sucesso."),
        @ApiResponse(responseCode = "400", description = "Erro ao criar escola.")
    })
    public ResponseEntity<?> createSchool(@RequestBody SchoolForm school) {
        return schoolService.createSchool(school);
    }

    @GetMapping("/{name}")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Escolas retornadas.")
    })
    public ResponseEntity<?> getSchoolsByName(@PathVariable String name) {
        return schoolService.getSchoolsByName(name);
    }

    @GetMapping()
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Todas as escolas retornadas.")
    })
    public ResponseEntity<?> listSchools() {
        return schoolService.getAllSchools();
    }

    @PutMapping()
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Escola atualizada com sucesso."),
        @ApiResponse(responseCode = "404", description = "Escola não encontrada.")
    })
    public ResponseEntity<?> updateSchool(@PathVariable Integer schoolId, @RequestBody SchoolForm school) {
        return schoolService.updateSchool(schoolId, school);
    }
}
