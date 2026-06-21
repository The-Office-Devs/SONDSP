package br.com.sondsp.entities.enums;

public enum UserSchoolClassFunction {
    TEACHER,
    SUB_TEACHER,
    COORDINATOR;

    public String getFunctionName() {
        return switch (this) {
            case TEACHER -> "Professor";
            case SUB_TEACHER -> "Professor substituto";
            case COORDINATOR -> "Coordenador";
        };
    }
}
