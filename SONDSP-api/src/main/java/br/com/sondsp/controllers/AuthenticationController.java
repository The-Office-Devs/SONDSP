package br.com.sondsp.controllers;

import br.com.sondsp.dtos.AuthenticationDTO;
import br.com.sondsp.dtos.UserDTO;
import br.com.sondsp.form.AuthenticationForm;
import br.com.sondsp.form.ChangePasswordForm;
import br.com.sondsp.form.FirstAccessForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import javax.security.auth.login.LoginException;

public interface AuthenticationController {
    @Operation(description = "Efetua o login do usuário", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário logado com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationDTO.class)
                    )
            )
    })
    ResponseEntity<?> login(@Valid @RequestBody AuthenticationForm form) throws LoginException;

    @Operation(description = "Envia email de troca de senha", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Email enviado com sucesso.",
                    content = @Content(
                            mediaType = "application/json"
                    )
            )
    })
    ResponseEntity<?> sendChangePasswordEmail(@RequestParam @Email String email);

    @Operation(description = "Realiza o primeiro acesso do usuário.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Primeiro acesso realizado com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            )
    })
    ResponseEntity<?> firstAccess(@RequestBody FirstAccessForm form);

    @Operation(description = "Realiza a troca de senha do usuário.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Senha trocada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            )
    })
    ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordForm form);
}
