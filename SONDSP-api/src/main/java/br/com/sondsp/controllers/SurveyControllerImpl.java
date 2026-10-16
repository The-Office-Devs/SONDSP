package br.com.sondsp.controllers;

import static br.com.sondsp.util.SystemMessages.SURVEY_DELETED;

import br.com.sondsp.dtos.ImageDTO;
import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.SurveyDTO;

import br.com.sondsp.dtos.*;
import br.com.sondsp.entities.Survey;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.SurveyFilter;
import br.com.sondsp.form.SurveyForm;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.SurveyService;
import br.com.sondsp.util.SystemMessages;
import jakarta.xml.bind.ValidationException;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/survey")
public class SurveyControllerImpl implements SurveyController {

	@Autowired
	private SurveyService surveyService;

	@Autowired
	private AuthenticationService authenticationService;

	@PostMapping
	public ResponseEntity<?> createSurvey(SurveyForm form) throws ValidationException, IOException {
		return ResponseEntity.ok().body(new SurveyDTO(surveyService.createSurvey(form)));
	}

	@GetMapping
	public ResponseEntity<?> getSurveys(SurveyFilter filter) {
		return ResponseEntity.ok().body(surveyService.listSurveys(filter).stream().map(SurveyDTO::new));
	}

	@GetMapping("/student-surveys/{id}")
	public ResponseEntity<PageResponse<SurveyDTO>> getStudentSurveys(
		Integer id,
		SurveyFilter filter,
		Pageable pageable
	) {
		User applicator = authenticationService
			.getCurrentUser()
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, SystemMessages.USER_NOT_FOUND));

		Page<Survey> surveyPage = surveyService.getStudentSurveys(id, applicator, filter, pageable);

		List<SurveyDTO> contentDTO = surveyPage.getContent().stream().map(SurveyDTO::new).toList();

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

	@PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
	public ResponseEntity<?> updateSurvey(Integer id, SurveyForm form) throws IOException {
		return ResponseEntity.ok().body(new SurveyDTO(surveyService.updateSurvey(id, form)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteSurvey(Integer id) throws ValidationException {
		surveyService.deleteSurvey(id);
		return ResponseEntity.ok(SURVEY_DELETED);
	}

	@GetMapping("get-survey-image/{id}")
	public ResponseEntity<?> getSurveyImage(Integer id) {
		String imageUrl = surveyService.getSurveyImageSignedUrl(id);
		return ResponseEntity.ok().body(new ImageDTO(imageUrl));
	}

	@Override
	@GetMapping("/activity/{activityId}/result-options")
	public ResponseEntity<List<br.com.sondsp.dtos.survey.SurveyResultOptionDTO>> getActivityResultOptions(@PathVariable Integer activityId) {
		return ResponseEntity.ok(surveyService.getResultOptionsForActivity(activityId));
	}

	@Override
	@GetMapping("/result-options")
	public ResponseEntity<List<br.com.sondsp.dtos.survey.SurveyResultOptionDTO>> getResultOptions(
			@RequestParam(required = false) String strandCode,
			@RequestParam(required = false) String gradeLevel
	) {
		return ResponseEntity.ok(surveyService.getResultOptions(strandCode, gradeLevel));
	}
}
