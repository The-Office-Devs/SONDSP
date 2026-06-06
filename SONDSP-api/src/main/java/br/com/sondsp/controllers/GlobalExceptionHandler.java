package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StandardErrorDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.xml.bind.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.security.auth.login.LoginException;

import static br.com.sondsp.util.SystemMessages.UNEXPECTED_ERROR;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({
            MethodArgumentNotValidException.class,
            ValidationException.class,
    })
    public ResponseEntity<StandardErrorDTO> invalidArg(Exception e) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(new StandardErrorDTO(e.getMessage()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<StandardErrorDTO> entityNotFound(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new StandardErrorDTO(e.getMessage()));
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<StandardErrorDTO> invalidCredentials(Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new StandardErrorDTO(e.getMessage()));
    }

    // Fallback para exceções não esperadas
    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardErrorDTO> globalException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new StandardErrorDTO(UNEXPECTED_ERROR));
    }
}
