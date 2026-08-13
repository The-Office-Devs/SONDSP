package br.com.sondsp.exceptions;

public class SchoolAlreadyExistsException extends RuntimeException {
    public SchoolAlreadyExistsException(String message) {
        super(message);
    }
}
