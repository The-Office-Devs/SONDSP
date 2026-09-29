package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.exceptions.SchoolAlreadyExistsException;
import br.com.sondsp.exceptions.UserAlreadyExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.web.server.ResponseStatusException;

import javax.security.auth.login.LoginException;

import static br.com.sondsp.util.SystemMessages.UNEXPECTED_ERROR;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<StandardErrorDTO> responseStatusException(ResponseStatusException e) {
        String message = e.getReason() != null ? e.getReason() : e.getMessage();
        return ResponseEntity.status(e.getStatusCode()).body(new StandardErrorDTO(message));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<StandardErrorDTO> invalidArg(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new StandardErrorDTO(e.getMessage()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<StandardErrorDTO> entityNotFound(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new StandardErrorDTO(e.getMessage()));
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<StandardErrorDTO> invalidCredentials(Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new StandardErrorDTO(e.getMessage()));
    }

    @ExceptionHandler({UserAlreadyExistsException.class, SchoolAlreadyExistsException.class})
    public ResponseEntity<StandardErrorDTO> resourceAlreadyExists(Exception e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new StandardErrorDTO(e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardErrorDTO> invalidArguments(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult().getAllErrors().stream().findFirst()
                .map(DefaultMessageSourceResolvable::getDefaultMessage).orElse(null);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new StandardErrorDTO(errorMessage));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<StandardErrorDTO> databaseException(DataAccessException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new StandardErrorDTO("Erro ao atualizar dados no banco"));
    }

    // Fallback para exceções não esperadas
    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardErrorDTO> globalException(Exception e) {
        return ResponseEntity.internalServerError().body(new StandardErrorDTO(UNEXPECTED_ERROR + e.getMessage()));
    }
}
