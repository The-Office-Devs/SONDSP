package br.com.sondsp.dtos;

import br.com.sondsp.entities.Student;

public record StudentDTO(
        Integer id,
        String name,
        String registration,
        SchoolClassDTO schoolClass,
        Integer rowNumber,
        Boolean status
) {
    public StudentDTO(Student student) {
        this(
                student.getId(),
                student.getName(),
                student.getRegistration(),
                student.getSchoolClass() == null ? null : new SchoolClassDTO(student.getSchoolClass()),
                student.getRowNumber(),
                student.getStatus()
        );
    }
}
