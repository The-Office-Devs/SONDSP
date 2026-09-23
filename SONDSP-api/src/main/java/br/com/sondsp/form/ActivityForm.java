package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

import static br.com.sondsp.util.SystemMessages.*;

public record ActivityForm(
        @NotBlank(message = EMPTY_NAME)
        String name,
        Integer strandId,
        String gradeLevel,
        String bimester,
        Boolean status,
        MultipartFile activityModelFile
) {
}