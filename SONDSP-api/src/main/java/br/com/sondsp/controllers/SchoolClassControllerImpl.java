package br.com.sondsp.controllers;

import br.com.sondsp.dtos.*;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.filters.ClassMapFilter;
import br.com.sondsp.filters.SchoolClassFilter;
import br.com.sondsp.form.SchoolClassForm;
import br.com.sondsp.services.ExportService;
import br.com.sondsp.services.SchoolClassService;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import static br.com.sondsp.util.SystemMessages.SCHOOL_CLASS_ACTIVATED;
import static br.com.sondsp.util.SystemMessages.SCHOOL_CLASS_DEACTIVATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/schoolClass")
public class SchoolClassControllerImpl implements SchoolClassController {

    @Autowired
    private SchoolClassService service;

    @Autowired
    private ExportService exportService;

    @PostMapping
    public ResponseEntity<?> createSchoolClass(SchoolClassForm form) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.createSchoolClass(form)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSchoolClassById(Integer id) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.getSchoolClass(id)));
    }

    @GetMapping
    public ResponseEntity<PageResponse<SchoolClassDTO>> getSchoolsClassesByFilter(
            SchoolClassFilter filter,
            Pageable pageable
    ) {
        Page<SchoolClass> schoolClassPage = service.getSchoolsClasses(filter, pageable);

        List<SchoolClassDTO> contentDTO = schoolClassPage.getContent().stream().map(SchoolClassDTO::new).toList();

        PageResponse<SchoolClassDTO> response = new PageResponse<>(
                contentDTO,
                schoolClassPage.getNumber(),
                schoolClassPage.getSize(),
                schoolClassPage.getTotalElements(),
                schoolClassPage.getTotalPages(),
                schoolClassPage.hasNext(),
                schoolClassPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchoolClass(Integer id, SchoolClassForm form) {
        return ResponseEntity.ok().body(new SchoolClassDTO(service.updateSchoolClass(id, form)));
    }

    @PatchMapping("/{id}/changeStatus")
    public ResponseEntity<?> changeStatus(Integer id) {
        if (service.changeStatus(id)) return ResponseEntity.ok(SCHOOL_CLASS_ACTIVATED);

        return ResponseEntity.ok(SCHOOL_CLASS_DEACTIVATED);
    }

    @GetMapping("/{id}/students-pannel")
    public ResponseEntity<?> getStudentsPannel(Integer id, String applicationPeriod, Integer strandId) {
        return ResponseEntity.ok().body(service.getStudentsPannel(id, applicationPeriod, strandId));
    }

	@GetMapping("/{id}/trajectory")
	public ResponseEntity<?> getStudentsTrajectory(Integer id, Integer strandId) {
		return ResponseEntity.ok().body(service.getStudentsTrajectory(id, strandId));
	}

    @GetMapping("/{id}/classMap")
    public ResponseEntity<ClassMapDTO> getClassMap(Integer id, ClassMapFilter filter) {
        return ResponseEntity.ok().body(service.getClassMap(id, filter));
    }

    @GetMapping("/report/school-class-surveys/{schoolClassId}")
    public ResponseEntity<ByteArrayResource> exportSchoolClassSurveys(
            @PathVariable Integer schoolClassId) throws IOException {

        SchoolClassSurveysReportDTO data = service.getSchoolClassSurveys(schoolClassId);

        byte[] content;
        try (Workbook report = exportService.getSchoolClassSurveysReport(data);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            report.write(out);
            content = out.toByteArray();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDisposition(ContentDisposition.attachment().filename("sondagens.xlsx").build());
        headers.setContentLength(content.length);
        headers.setAccessControlExposeHeaders(List.of(HttpHeaders.CONTENT_DISPOSITION));
        return new ResponseEntity<>(new ByteArrayResource(content), headers, OK);
    }
}
