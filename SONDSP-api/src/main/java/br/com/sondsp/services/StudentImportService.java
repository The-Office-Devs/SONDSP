package br.com.sondsp.services;

import static br.com.sondsp.util.SystemMessages.*;

import br.com.sondsp.dtos.StudentImportResultDTO;
import br.com.sondsp.entities.School;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.entities.Student;
import br.com.sondsp.imports.StudentImportFile;
import br.com.sondsp.imports.StudentImportParser;
import br.com.sondsp.repositories.SchoolClassRepository;
import br.com.sondsp.repositories.SchoolRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.util.DateUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@AllArgsConstructor
public class StudentImportService {

    private final StudentImportParser parser;
    private final SchoolRepository schoolRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public StudentImportResultDTO importStudents(MultipartFile file) {
        StudentImportFile data = parser.parse(file);

        School school = schoolRepository
                .findByCodigoInterno(data.schoolCode())
                .orElseThrow(() ->
                        new EntityNotFoundException(String.format(IMPORT_SCHOOL_NOT_FOUND, data.schoolCode(), data.schoolName()))
                );
        if (!Boolean.TRUE.equals(school.getStatus())) {
            throw new ValidationException(String.format(IMPORT_SCHOOL_INACTIVE, school.getName()));
        }

        boolean classCreated = false;
        SchoolClass schoolClass = schoolClassRepository.findByCodigoInterno(data.classCode()).orElse(null);

        if (schoolClass != null) {
            if (!Objects.equals(schoolClass.getSchool().getId(), school.getId())) {
                throw new ValidationException(String.format(IMPORT_CLASS_OTHER_SCHOOL, data.classCode()));
            }
            if (!Boolean.TRUE.equals(schoolClass.getStatus())) {
                throw new ValidationException(String.format(IMPORT_CLASS_INACTIVE, schoolClass.getName()));
            }
        } else {
            schoolClass = schoolClassRepository
                    .findBySchoolIdAndNameAndGradeLevelAndSchoolYearAndShiftAndCodigoInternoIsNull(
                            school.getId(), data.className(), data.className(), data.schoolYear(), data.shift()
                    )
                    .orElse(null);

            if (schoolClass != null) {
                if (!Boolean.TRUE.equals(schoolClass.getStatus())) {
                    throw new ValidationException(String.format(IMPORT_CLASS_INACTIVE, schoolClass.getName()));
                }
                schoolClass.setCodigoInterno(data.classCode());
            } else {
                schoolClass = SchoolClass
                        .builder()
                        .school(school)
                        .codigoInterno(data.classCode())
                        .name(data.className())
                        .gradeLevel(data.className())
                        .schoolYear(data.schoolYear())
                        .shift(data.shift())
                        .status(true)
                        .build();
                classCreated = true;
            }
            schoolClass = schoolClassRepository.save(schoolClass);
        }

        Set<String> registrationsInFile = data.students()
                .stream()
                .map(StudentImportFile.Row::registration)
                .collect(Collectors.toSet());

        List<Student> toUnlink = studentRepository
                .findAllBySchoolClassId(schoolClass.getId())
                .stream()
                .filter(s -> !registrationsInFile.contains(s.getRegistration()))
                .toList();

        toUnlink.forEach(s -> {
            s.setSchoolClass(null);
            s.setRowNumber(null);
            s.setClassEntryDate(null);
        });
        studentRepository.saveAllAndFlush(toUnlink);

        Map<String, Student> existing = studentRepository
                .findAllByRegistrationIn(registrationsInFile)
                .stream()
                .collect(Collectors.toMap(Student::getRegistration, Function.identity(), (a, b) -> a));

        int created = 0;
        int updated = 0;
        List<Student> toSave = new ArrayList<>();

        for (StudentImportFile.Row row : data.students()) {
            Student student = existing.get(row.registration());

            boolean classChanged =
                    student == null ||
                            student.getSchoolClass() == null ||
                            !Objects.equals(student.getSchoolClass().getId(), schoolClass.getId());

            if (student == null) {
                student = new Student();
                student.setRegistration(row.registration());
                created++;
            } else {
                updated++;
            }

            student.setName(row.name());
            student.setBirthDate(row.birthDate());
            student.setRowNumber(row.rowNumber());
            student.setSchoolClass(schoolClass);
            student.setStatus(true);

            if (classChanged || student.getClassEntryDate() == null) {
                student.setClassEntryDate(row.classEntryDate() != null ? row.classEntryDate() : DateUtils.today());
            }

            toSave.add(student);
        }

        studentRepository.saveAll(toSave);

        return new StudentImportResultDTO(
                school.getName(), schoolClass.getName(), classCreated,
                created, updated, toUnlink.size(), data.ignored()
        );
    }
}