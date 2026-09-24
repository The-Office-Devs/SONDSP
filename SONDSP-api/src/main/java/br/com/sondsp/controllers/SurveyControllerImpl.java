package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SurveyDTO;
import br.com.sondsp.entities.Survey;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.SurveyService;
import br.com.sondsp.util.SystemMessages;
import jakarta.xml.bind.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

import static br.com.sondsp.util.SystemMessages.ERROR_RETRIEVING_IMAGE;
import static br.com.sondsp.util.SystemMessages.SURVEY_DELETED;

@RestController
@RequestMapping("/survey")
public class SurveyControllerImpl {
    @Autowired
    private SurveyService surveyService;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping
    public ResponseEntity<?> createSurvey(@RequestBody SurveyForm form) {
        Optional<User> creator = authenticationService.getCurrentUser();
        if (creator.isPresent()) {
            return ResponseEntity.ok().body(new SurveyDTO(surveyService.createSurvey(form, creator.get())));

        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SystemMessages.USER_NOT_FOUND);
        }
    }

    @GetMapping()
    public ResponseEntity<?> getSurveys(@ModelAttribute SurveyFilter filter) {
        return ResponseEntity.ok().body(surveyService.listSurveys(filter).stream().map(SurveyDTO::new));
    }

    @GetMapping("/student-surveys/{id}")
    public ResponseEntity<PageResponse<SurveyDTO>> getStudentSurveys(
            @PathVariable Integer id,
            @ModelAttribute SurveyFilter filter,
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "status", direction = Sort.Direction.ASC),
                    @SortDefault(sort = "activity.strand.subject", direction = Sort.Direction.ASC),
                    @SortDefault(sort = "activity.name", direction = Sort.Direction.ASC, caseSensitive = false)
            }) Pageable pageable) {

        User applicator = authenticationService.getCurrentUser()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, SystemMessages.USER_NOT_FOUND));

        Page<Survey> surveyPage = surveyService.getStudentSurveys(id, applicator, filter, pageable);

        List<SurveyDTO> contentDTO = surveyPage.getContent().stream()
                .map(SurveyDTO::new)
                .toList();

        PageResponse<SurveyDTO> response = new PageResponse<>(
                contentDTO,
                surveyPage.getNumber(),
                surveyPage.getSize(),
                surveyPage.getTotalElements(),
                surveyPage.getTotalPages(),
                surveyPage.hasNext(),
                surveyPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateSurvey(@PathVariable Integer id, @ModelAttribute SurveyForm form) {
        return ResponseEntity.ok().body(new SurveyDTO(surveyService.updateSurvey(id, form)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSurvey(@PathVariable Integer id) throws ValidationException {
        surveyService.deleteSurvey(id);
        return ResponseEntity.ok(SURVEY_DELETED);
    }

    @GetMapping("get-survey-image/{id}")
    public ResponseEntity<Resource> getSurveyImage(@PathVariable Integer id) {
        Resource resource = surveyService.getSurveyImage(id);

        String contentType = "application/octet-stream";
        try {
            contentType = Files.probeContentType(resource.getFile().toPath());
        } catch (IOException e) {
            throw new RuntimeException(ERROR_RETRIEVING_IMAGE);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
