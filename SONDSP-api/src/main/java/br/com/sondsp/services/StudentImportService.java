package br.com.sondsp.services;

import br.com.sondsp.dtos.StudentImportResultDTO;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.entities.Student;
import br.com.sondsp.imports.StudentImportFile;
import br.com.sondsp.imports.StudentImportParser;
import br.com.sondsp.repositories.SchoolClassRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.util.DateUtils;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static br.com.sondsp.util.SystemMessages.IMPORT_CLASS_INACTIVE;

@Service
@AllArgsConstructor
public class StudentImportService {

    private final StudentImportParser parser;
    private final SchoolClassRepository schoolClassRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public StudentImportResultDTO importStudents(MultipartFile file) {
        StudentImportFile data = parser.parse(file);

        boolean classCreated = false;
        SchoolClass schoolClass = schoolClassRepository.findByCodigoInterno(data.classCode()).orElse(null);

        if (schoolClass != null) {
            if (!Boolean.TRUE.equals(schoolClass.getStatus())) {
                throw new ValidationException(String.format(IMPORT_CLASS_INACTIVE, schoolClass.getName()));
            }
        } else {
            schoolClass = schoolClassRepository
                    .findByNameAndGradeLevelAndSchoolYearAndShiftAndCodigoInternoIsNull(
                            data.className(), data.className(), data.schoolYear(), data.shift()
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
                schoolClass.getName(), classCreated,
                created, updated, toUnlink.size(), data.ignored()
        );
    }
}