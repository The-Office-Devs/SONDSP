package br.com.sondsp.entities.enums;

public enum UserRoles {
    ADMINISTRATOR,
    SCHOOL_ADMINISTRATOR,
    COORDINATOR,
    TEACHER;

    public String getRoleName() {
        return switch (this) {
            case ADMINISTRATOR -> "Administrador";
            case SCHOOL_ADMINISTRATOR -> "Administrador de Escola";
            case COORDINATOR -> "Coordenador";
            case TEACHER -> "Professor";
        };
    }
}
