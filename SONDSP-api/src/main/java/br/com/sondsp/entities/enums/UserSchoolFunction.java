package br.com.sondsp.entities.enums;

public enum UserSchoolFunction {
    TEACHER,
    SUB_TEACHER,
    COORDINATOR,
    PRINCIPAL;

    public String getFunctionName() {
        return switch (this) {
          case TEACHER -> "Professor";
          case SUB_TEACHER -> "Professor substituto";
          case COORDINATOR -> "Coordenador";
          case PRINCIPAL -> "Diretor";
        };
    }
}
