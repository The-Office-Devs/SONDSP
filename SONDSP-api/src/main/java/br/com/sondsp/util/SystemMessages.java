package br.com.sondsp.util;

public final class SystemMessages {
    // System errors
    public static final String UNEXPECTED_ERROR = "Ocorreu um erro inesperado: ";

    // Format or business logic errors
    public static final String EMAIL_ALREADY_EXISTS = "O email já está sendo utilizado.";
    public static final String REGISTRATION_ALREADY_EXISTS = "A matrícula já existe";
    public static final String INVALID_EMAIL_FORMAT = "Email inválido.";
    public static final String INACTIVATED_USER = "Usuário inativo.";
    public static final String INVALID_YEAR = "O ano deve ser um ano letivo válido.";

    // Empty properties
    public static final String EMPTY_NAME = "Um nome deve ser informado.";
    public static final String EMPTY_EMAIL = "Um email deve ser informado.";
    public static final String EMPTY_REGISTRATION = "Uma matrícula deve ser informada.";
    public static final String EMPTY_ROLE = "Ocorreu um erro inesperado.";
    public static final String EMPTY_PERMISSIONS = "As permissões devem ser informadas.";
    public static final String EMPTY_STATUS = "Um status deve ser informado.";
    public static final String EMPTY_PASSWORD = "Uma senha deve ser informada.";
    public static final String EMPTY_PERMISSION = "Pelo menos uma permissão deve ser informada.";
    public static final String EMPTY_LOGIN = "Deve ser passado um email ou matrícula.";
    public static final String EMPTY_PERMISISON = "A permissão não pode ser vazia.";
    public static final String EMPTY_SCHOOL = "Deve ser passada uma escola.";
    public static final String EMPTY_YEAR = "Deve ser passado o ano escolar.";
    public static final String EMPTY_PRINCIPAL = "Deve ser passado o nome do diretor.";
    public static final String EMPTY_SUBJECT = "Uma matéria deve ser informado.";
    public static final String EMPTY_AXIS = "Um eixo deve ser informado.";
    public static final String EMPTY_MODEL = "Um modelo deve ser informado.";

    // User errors
    public static final String USER_NOT_FOUND = "o usuário não foi encontrado.";
    public static final String EMAIL_NOT_FOUND = "O email não foi encontrado.";
    public static final String EMAIL_OR_REGISTRATION_NOT_FOUND = "O email ou a matrícula são inválidos.";
    public static final String USER_ALREADY_ACTIVE = "O usuário já está ativo.";
    public static final String SCHOOL_NOT_FOUND = "A escola não foi encontrada.";
    public static final String INVALID_CREDENTIALS = "E-mail ou senha inválidos";
    public static final String USER_ALREADY_EXISTS = "O usuário já existe.";

    public static final String SCHOOL_CLASS_NOT_FOUND = "A turma não foi encontrada.";
    public static final String STUDENT_NOT_FOUND = "O aluno não foi encontrado.";
    public static final String ACTIVITY_NOT_FOUND = "A atividade não foi encontrada.";

    // Private constructor makes class not instantiable
    private SystemMessages() {}
}
