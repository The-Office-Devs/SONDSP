package br.com.sondsp.services;

import br.com.sondsp.dtos.SchoolClassDTO;
import br.com.sondsp.dtos.portfolio.EnrollmentHistoryItemDTO;
import br.com.sondsp.dtos.portfolio.StudentPortfolioDTO;
import br.com.sondsp.entities.Student;
import br.com.sondsp.repositories.StudentEnrollmentRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.util.DateUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.STUDENT_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class StudentPortfolioService {

    private final StudentRepository studentRepository;
    private final StudentEnrollmentRepository enrollmentRepository;

    @Transactional(readOnly = true)
    public StudentPortfolioDTO getStudentPortfolio(Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException(STUDENT_NOT_FOUND));

        String initials = StudentPortfolioDTO.computeInitials(student.getName());

        String currentClassName = (student.getSchoolClass() != null)
                ? student.getSchoolClass().getName()
                : "Sem turma";

        SchoolClassDTO schoolClassDTO = (student.getSchoolClass() != null)
                ? new SchoolClassDTO(student.getSchoolClass())
                : null;

        String schoolName = (student.getSchoolClass() != null && student.getSchoolClass().getSchool() != null)
                ? student.getSchoolClass().getSchool().getName()
                : "Sem escola vinculada";

        String schoolYear = (student.getSchoolClass() != null && student.getSchoolClass().getSchoolYear() != null)
                ? student.getSchoolClass().getSchoolYear()
                : "2026";

        String status = Boolean.TRUE.equals(student.getStatus()) ? "ATIVO" : "INATIVO";

        List<EnrollmentHistoryItemDTO> enrollmentHistory = enrollmentRepository
                .findAllByStudentIdOrderBySchoolYearDescStartDateDesc(studentId)
                .stream()
                .map(EnrollmentHistoryItemDTO::new)
                .toList();

        return new StudentPortfolioDTO(
                student.getId(),
                student.getName(),
                initials,
                currentClassName,
                schoolClassDTO,
                schoolName,
                schoolYear,
                student.getRegistration(),
                student.getRowNumber(),
                DateUtils.format(student.getBirthDate()),
                status,
                enrollmentHistory
        );
    }
}
