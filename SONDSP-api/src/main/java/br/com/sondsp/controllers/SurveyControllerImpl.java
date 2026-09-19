package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.dtos.SurveyDTO;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.SurveyService;
import br.com.sondsp.util.SystemMessages;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.xml.bind.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static br.com.sondsp.util.SystemMessages.SURVEY_DELETED;

@RestController
@RequestMapping("/survey")
public class SurveyControllerImpl {
    @Autowired
    private SurveyService surveyService;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createSurvey(@ModelAttribute SurveyForm form) {
        Optional<User> creator = authenticationService.getCurrentUser();
        if (creator.isPresent()) {
            return ResponseEntity.ok().body(new SurveyDTO(surveyService.createSurvey(form, creator.get())));

        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SystemMessages.USER_NOT_FOUND);
        }
    }

    @GetMapping()
    public ResponseEntity<?> getActivities(@ModelAttribute SurveyFilter filter) {
        return ResponseEntity.ok().body(surveyService.listSurveys(filter).stream().map(SurveyDTO::new));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSurvey(@PathVariable Integer id, @RequestBody SurveyForm form) {
        return ResponseEntity.ok().body(new SurveyDTO(surveyService.updateSurvey(id, form)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSurvey(@PathVariable Integer id) throws ValidationException {
        surveyService.deleteSurvey(id);
        return ResponseEntity.ok(SURVEY_DELETED);
    }
}
