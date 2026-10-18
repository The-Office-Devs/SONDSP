package br.com.sondsp.dtos;

import br.com.sondsp.entities.Student;
import br.com.sondsp.util.DateUtils;

public record StudentDTO(
        Integer id,
        String name,
        String registration,
        SchoolClassDTO schoolClass,
        Integer rowNumber,
        String birthDate,
        String classEntryDate,
        Boolean status
) {
    public StudentDTO(Student student) {
        this(
                student.getId(),
                student.getName(),
                student.getRegistration(),
                student.getSchoolClass() == null ? null : new SchoolClassDTO(student.getSchoolClass()),
                student.getRowNumber(),
                DateUtils.format(student.getBirthDate()),
                DateUtils.format(student.getClassEntryDate()),
                student.getStatus()
        );
    }
}
