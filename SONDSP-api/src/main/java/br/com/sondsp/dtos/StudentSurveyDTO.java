package br.com.sondsp.dtos;

import br.com.sondsp.entities.Student;

import java.util.List;

public record StudentSurveyDTO(
        Integer id,
        String name,
        String registration,
        List<SurveyDTO> surveys,
        Boolean status
) {
    public StudentSurveyDTO(Student student, List<SurveyDTO> surveys) {
        this(
                student.getId(),
                student.getName(),
                student.getRegistration(),
                surveys,
                student.getStatus()
        );
    }
}