package br.com.sondsp.entities.enums;

public enum UserRoles {
    ADMINISTRATOR,
    SCHOOL_ADMINISTRATOR,
    COORDINATOR,
    TEACHER;

    public String getRoleName() {
        return switch (this) {
            case ADMINISTRATOR -> "Administrator";
            case SCHOOL_ADMINISTRATOR -> "School Administrator";
            case COORDINATOR -> "Coordinator";
            case TEACHER -> "Teacher";
        };
    }
}
