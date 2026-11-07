package br.com.sondsp.controllers;

import static br.com.sondsp.util.SystemMessages.SURVEY_DELETED;

import br.com.sondsp.dtos.*;
import br.com.sondsp.dtos.survey.SurveyResultOptionDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
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
	@PreAuthorize("hasAuthority('SONDAGEM_MANAGE')")
	public ResponseEntity<?> createSurvey(SurveyForm form) throws ValidationException, IOException {
		return ResponseEntity.ok().body(new SurveyDTO(surveyService.createSurvey(form)));
	}

	@GetMapping
	@PreAuthorize("hasAuthority('SONDAGEM_VIEW')")
	public ResponseEntity<?> getSurveys(SurveyFilter filter) {
		return ResponseEntity.ok().body(surveyService.listSurveys(filter).stream().map(SurveyDTO::new));
	}

	@GetMapping("/student-surveys/{id}")
	@PreAuthorize("hasAuthority('SONDAGEM_VIEW')")
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
	@PreAuthorize("hasAuthority('SONDAGEM_MANAGE')")
	public ResponseEntity<?> updateSurvey(Integer id, SurveyForm form) throws IOException, ValidationException {
		return ResponseEntity.ok().body(new SurveyDTO(surveyService.updateSurvey(id, form)));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAuthority('SONDAGEM_DELETE')")
	public ResponseEntity<?> deleteSurvey(Integer id) throws ValidationException {
		surveyService.deleteSurvey(id);
		return ResponseEntity.ok(SURVEY_DELETED);
	}

	@GetMapping("get-survey-image/{id}")
	@PreAuthorize("hasAuthority('SONDAGEM_VIEW')")
	public ResponseEntity<?> getSurveyImage(Integer id) {
		String imageUrl = surveyService.getSurveyImageSignedUrl(id);
		return ResponseEntity.ok().body(new ImageDTO(imageUrl));
	}

	@Override
	@GetMapping("/activity/{activityId}/result-options")
	@PreAuthorize("hasAuthority('SONDAGEM_VIEW')")
	public ResponseEntity<List<SurveyResultOptionDTO>> getActivityResultOptions(Integer activityId) {
		return ResponseEntity.ok(surveyService.getResultOptionsForActivity(activityId));
	}

	@Override
	@GetMapping("/result-options")
	@PreAuthorize("hasAuthority('SONDAGEM_VIEW')")
	public ResponseEntity<List<SurveyResultOptionDTO>> getResultOptions(String strandCode, String gradeLevel) {
		return ResponseEntity.ok(surveyService.getResultOptions(strandCode, gradeLevel));
	}

	@PatchMapping("/{id}/startSurveyAsDigital")
	@PreAuthorize("hasAuthority('SONDAGEM_DIGITAL_MANAGE')")
	public ResponseEntity<SurveyDTO> startSurveyAsDigital(Integer id) throws ValidationException {
		return ResponseEntity.ok().body(new SurveyDTO(surveyService.startDigitalSurvey(id)));
	}

	@PatchMapping("/{id}/updateResponse")
	@PreAuthorize("hasAuthority('SONDAGEM_DIGITAL_MANAGE')")
	public ResponseEntity<?> updateResponse(Integer id, String response) throws ValidationException {
		surveyService.updateResponse(id, response);
		return ResponseEntity.ok().build();
	}

	@PatchMapping("/{id}/closesDifitalSurvey")
	@PreAuthorize("hasAuthority('SONDAGEM_DIGITAL_MANAGE')")
	public ResponseEntity<SurveyDTO> closeDigitalSurvey(Integer id) throws ValidationException {
		return ResponseEntity.ok().body(new SurveyDTO(surveyService.closeDigitalSurvey(id)));
	}
}
