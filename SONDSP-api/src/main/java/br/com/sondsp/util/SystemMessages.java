package br.com.sondsp.util;

public final class SystemMessages {
    // System errors
    public static final String UNEXPECTED_ERROR = "Ocorreu um erro inesperado: ";

    // Format or business logic errors
    public static final String EMAIL_ALREADY_EXISTS = "O email já está sendo utilizado.";
    public static final String REGISTRATION_ALREADY_EXISTS = "A matrícula já existe";
    public static final String INVALID_EMAIL_FORMAT = "Email inválido.";
    public static final String INACTIVATED_USER = "Usuário inátivo.";
    public static final String INVALID_YEAR = "O ano deve ser um ano letivo válido.";

    // Empty properties
    public static final String EMPTY_NAME = "Deve ser passado um nome.";
    public static final String EMPTY_EMAIL = "Deve ser passado um email.";
    public static final String EMPTY_REGISTRATION = "Deve ser passada a matrícula.";
    public static final String EMPTY_ROLE = "Ocorreu um erro inesperado.";
    public static final String EMPTY_PERMISSIONS = "Devem ser passadas as permissões.";
    public static final String EMPTY_STATUS = "Deve ser passado o status.";
    public static final String EMPTY_PASSWORD = "Deve ser passada uma senha.";
    public static final String EMPTY_LOGIN = "Deve ser passado um email ou matrícula.";
    public static final String EMPTY_PERMISISON = "A permissão não pode ser vazia.";
    public static final String EMPTY_SCHOOL = "Deve ser passada uma escola.";
    public static final String EMPTY_YEAR = "Deve ser passado o ano escolar.";
    public static final String EMPTY_PRINCIPAL = "Deve ser passado o nome do diretor.";

    // User errors
    public static final String USER_NOT_FOUND = "Usuário não foi encontrado.";
    public static final String EMAIL_NOT_FOUND = "O email não foi encontrado.";
    public static final String EMAIL_OR_REGISTRATION_NOT_FOUND = "O email ou a matrícula são inválidos.";
    public static final String USER_ALREADY_ACTIVE = "O usuário já está ativo.";
    public static final String SCHOOL_NOT_FOUND = "A escola não foi encontrada.";
    public static final String INVALID_CREDENTIALS = "Login ou senha inválidos.";
    public static final String USER_ALREADY_EXISTS = "As credenciais já existem.";
    public static final String SCHOOL_CLASS_NOT_FOUND = "A turma não foi encontrada.";
    public static final String STUDENT_NOT_FOUND = "O aluno não foi encontrado.";

    // Private constructor makes class not instantiable
    private SystemMessages() {}
}
