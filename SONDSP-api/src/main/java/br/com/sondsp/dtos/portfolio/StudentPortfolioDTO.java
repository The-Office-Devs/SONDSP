package br.com.sondsp.dtos.portfolio;

import br.com.sondsp.dtos.SchoolClassDTO;

import java.util.List;

public record StudentPortfolioDTO(
    Integer id,
    String name,
    String initials,
    String currentClass,
    SchoolClassDTO currentSchoolClass,
    String school,
    String schoolYear,
    String registration,
    Integer rowNumber,
    String status,
    List<EnrollmentHistoryItemDTO> enrollmentHistory
) {
    public static String computeInitials(String name) {
        if (name == null || name.isBlank()) return "";
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        }
        return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
    }
}
