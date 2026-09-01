package br.com.sondsp.util;

public final class SystemMessages {
    // System errors
    public static final String UNEXPECTED_ERROR = "Ocorreu um erro inesperado: ";

    // Status toggling
    public static final String USER_ACTIVATED = "Usuário ativado com sucesso.";
    public static final String USER_DEACTIVATED = "Usuário desativado com sucesso.";
    public static final String STUDENT_ACTIVATED = "Aluno ativado com sucesso.";
    public static final String STUDENT_DEACTIVATED = "Aluno desativado com sucesso.";
    public static final String SCHOOL_ACTIVATED = "Escola ativada com sucesso.";
    public static final String SCHOOL_DEACTIVATED = "Escola desativada com sucesso.";
    public static final String SCHOOL_CLASS_ACTIVATED = "Turma ativada com sucesso.";
    public static final String SCHOOL_CLASS_DEACTIVATED = "Turma desativada com sucesso.";

    // Linking
    public static final String USER_LINKED_TO_SCHOOL_CLASS = "Usuário vinculado à turma com sucesso.";
    public static final String USER_UNLINKED_TO_SCHOOL_CLASS = "Usuário desvinculado da turma com sucesso.";
    public static final String USER_LINKED_TO_SCHOOL = "Usuário vinculado à escola com sucesso.";
    public static final String USER_UNLINKED_TO_SCHOOL = "Usuário desvinculado da escola com sucesso.";

    // Not found
    public static final String USER_NOT_FOUND = "O usuário não foi encontrado.";
    public static final String EMAIL_NOT_FOUND = "O email não foi encontrado.";
    public static final String STRAND_NOT_FOUND = "O eixo não foi encontrado.";
    public static final String SCHOOL_CLASS_NOT_FOUND = "A turma não foi encontrada.";
    public static final String STUDENT_NOT_FOUND = "O aluno não foi encontrado.";
    public static final String SCHOOL_NOT_FOUND = "A escola não foi encontrada.";
    public static final String ROLE_NOT_FOUND = "A função não foi encontrada.";

    // Auth
    public static final String EMAIL_ALREADY_EXISTS = "O email já está sendo utilizado.";
    public static final String REGISTRATION_ALREADY_EXISTS = "O registro funcional já está sendo utilizado.";
    public static final String INVALID_EMAIL_FORMAT = "Email inválido.";
    public static final String INACTIVATED_USER = "Usuário inativo.";
    public static final String EMAIL_OR_REGISTRATION_NOT_FOUND = "O email ou o registro funcional são inválidos.";
    public static final String USER_ALREADY_ACTIVE = "O usuário já está ativo.";
    public static final String INVALID_CREDENTIALS = "E-mail ou senha inválidos.";
    public static final String FIRST_ACCESS_NOT_DONE = "O usuário ainda não fez o primeiro acesso.";

    // Format or business logic errors
    public static final String INVALID_YEAR = "O ano deve ser um ano letivo válido.";
    public static final String SCHOOL_CANNOT_INACTIVATE = "A escola não pode ser inativada, pois existem turmas ativas.";
    public static final String SCHOOL_CLASS_ALREADY_EXISTS = "A turma já existe para essa escola.";
    public static final String SCHOOL_CLASS_CANNOT_INACTIVATE = "A turma não pode ser inativada, pois existem alunos ativos.";
    public static final String SCHOOL_CLASS_CANNOT_ACTIVATE = "A turma não pode ser ativada, pois a escola está inativa.";
    public static final String ROW_NUMBER_TAKEN = "O número de chamada passado já está sendo utilizado por um aluno na turma.";
    public static final String STUDENT_REGISTRATION_ALREADY_EXISTS = "A matrícula já está sendo utilizada.";
    public static final String STUDENT_CANNOT_ACTIVATE = "O aluno não pode ser ativado, pois a turma está inativa.";
    public static final String INEP_ALREADY_EXISTS = "Este código INEP já está cadastrado";
    public static final String INVALID_INEP_FORMAT = "Formato de código INEP inválido (deve ter 8 dígitos)";
    public static final String INVALID_REGISTRATION_FORMAT = "O formato do registro funcional está incorreto.";
    public static final String MUST_HAVE_CLASS = "O aluno deve estar em uma turma para ter número da chamada.";
    public static final String MUST_HAVE_ROW_NUMBER = "O aluno deve possuir um número de chamada na turma.";

    // Empty properties
    public static final String EMPTY_DATA = "Preencha todos os dados obrigatórios.";
    public static final String EMPTY_NAME = "Um nome deve ser informado.";
    public static final String EMPTY_EMAIL = "Um email deve ser informado.";
    public static final String EMPTY_REGISTRATION = "Um registro funcional deve ser informado.";
    public static final String EMPTY_ROLE = "A função do usuário deve ser passada.";
    public static final String EMPTY_PERMISSIONS = "As permissões devem ser informadas.";
    public static final String EMPTY_PASSWORD = "Uma senha deve ser informada.";
    public static final String EMPTY_PERMISSION = "Pelo menos uma permissão deve ser informada.";
    public static final String EMPTY_SCHOOL = "Uma escola deve ser informada.";
    public static final String EMPTY_YEAR = "Um ano letivo deve ser informado.";
    public static final String EMPTY_PRINCIPAL = "O nome de diretor deve ser informado.";
    public static final String EMPTY_INEP = "O código INEP é obrigatório";
    public static final String EMPTY_FUNCTION = "A função do usuário deve ser informada.";
    public static final String EMPTY_SCHOOL_CLASS = "Uma turma deve ser informada.";
    public static final String EMPTY_SUBJECT = "Uma matéria deve ser informado.";
    public static final String EMPTY_AXIS = "Um eixo deve ser informado.";
    public static final String EMPTY_MODEL = "Um modelo deve ser informado.";
    public static final String EMPTY_STATUS = "Um status deve ser informado.";

    // Private constructor makes class not instantiable
    private SystemMessages() {}
}
