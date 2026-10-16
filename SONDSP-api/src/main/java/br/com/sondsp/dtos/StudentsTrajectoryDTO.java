package br.com.sondsp.dtos;

public record StudentsTrajectoryDTO(
    StudentSimplestDTO student,
    TrajectoryResultDTO results
) {}
