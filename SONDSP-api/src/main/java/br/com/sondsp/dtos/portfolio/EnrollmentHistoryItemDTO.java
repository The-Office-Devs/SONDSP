package br.com.sondsp.dtos.portfolio;

import br.com.sondsp.entities.StudentEnrollment;
import br.com.sondsp.entities.enums.EnrollmentStatus;

import java.time.LocalDate;

public record EnrollmentHistoryItemDTO(
    Integer id,
    String year,
    String schoolClass,
    EnrollmentSchoolClassRefDTO schoolClassDetails,
    String externalDescription,
    EnrollmentStatus status,
    String statusLabel,
    LocalDate startDate,
    LocalDate endDate
) {
    public EnrollmentHistoryItemDTO(StudentEnrollment enrollment) {
        this(
            enrollment.getId(),
            enrollment.getSchoolYear(),
            enrollment.getSchoolClass() != null 
                ? enrollment.getSchoolClass().getName() 
                : (enrollment.getExternalDescription() != null ? enrollment.getExternalDescription() : "Histórico Externo"),
            enrollment.getSchoolClass() != null ? new EnrollmentSchoolClassRefDTO(
                enrollment.getSchoolClass().getId(),
                enrollment.getSchoolClass().getName(),
                enrollment.getSchoolClass().getGradeLevel(),
                enrollment.getSchoolClass().getSchool() != null ? enrollment.getSchoolClass().getSchool().getName() : null
            ) : null,
            enrollment.getExternalDescription(),
            enrollment.getStatus(),
            enrollment.getStatus() != null ? enrollment.getStatus().getLabel() : null,
            enrollment.getStartDate(),
            enrollment.getEndDate()
        );
    }
}
